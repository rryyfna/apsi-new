import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { kodeMk, namaMk, sks, semester, isNonTeaching, namaMkEn, deskripsiEn, prasyaratId } = body;

    const mk = await prisma.mataKuliah.update({
      where: { id },
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

    return NextResponse.json(mk);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Kode Mata Kuliah sudah digunakan' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.mataKuliah.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
