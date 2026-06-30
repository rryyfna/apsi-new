import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.cPL.findMany({
      include: {
        ik: {
          include: {
            cpmkMappings: {
              include: {
                cpmk: {
                  include: {
                    mataKuliah: true
                  }
                }
              }
            }
          }
        }
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
    const { kode, deskripsi, deskripsiEn, ikMappings } = body;

    if (!kode || !deskripsi) {
      return NextResponse.json({ error: 'Kode dan Deskripsi wajib diisi' }, { status: 400 });
    }

    const cpl = await prisma.cPL.create({
      data: {
        kode,
        deskripsi,
        deskripsiEn,
      },
    });

    if (ikMappings && Array.isArray(ikMappings) && ikMappings.length > 0) {
      for (const m of ikMappings) {
        await prisma.iK.update({
          where: { id: m.ikId },
          data: {
            cplId: cpl.id,
            bobot: parseFloat(m.bobot) || 0
          }
        });
      }
    }

    return NextResponse.json(cpl, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Kode CPL sudah digunakan' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
