import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.iK.findMany({
      include: {
        cpmkMappings: {
          include: {
            cpmk: {
              include: {
                mataKuliah: true
              }
            }
          }
        },
        cpl: true
      },
      orderBy: { kode: 'asc' },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kode, deskripsi, deskripsiEn, bobot, cplId, cpmkMappings } = body;

    if (!kode || !deskripsi) {
      return NextResponse.json({ error: 'Kode dan Deskripsi wajib diisi' }, { status: 400 });
    }

    const ik = await prisma.iK.create({
      data: {
        kode,
        deskripsi,
        deskripsiEn,
        bobot: bobot ? parseFloat(bobot) : 0,
        cplId: cplId || null,
        cpmkMappings: {
          create: cpmkMappings?.map((mapping: any) => ({
            cpmkId: mapping.cpmkId,
            bobot: parseFloat(mapping.bobot) || 0,
          })) || []
        }
      },
    });

    return NextResponse.json(ik, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Kode IK sudah digunakan' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
