import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.mataKuliah.findMany({
      orderBy: { kodeMk: 'asc' },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kodeMk, namaMk, sks, semester, isNonTeaching, namaMkEn, deskripsiEn, prasyaratId } = body;

    // Validation
    if (!kodeMk || !namaMk || sks === undefined) {
      return NextResponse.json({ error: 'Kode, Nama, dan SKS wajib diisi' }, { status: 400 });
    }

    const mk = await prisma.mataKuliah.create({
      data: {
        kodeMk,
        namaMk,
        sks: parseInt(sks),
        semester: semester ? parseInt(semester) : null,
        isNonTeaching: isNonTeaching ?? false,
        namaMkEn,
        deskripsiEn,
        prasyaratId: prasyaratId || null,
      },
    });

    return NextResponse.json(mk, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Kode Mata Kuliah sudah digunakan' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
