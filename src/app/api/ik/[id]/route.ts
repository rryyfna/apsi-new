import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { kode, deskripsi, deskripsiEn, bobot, cplId, cpmkMappings } = body;

    // Update IK data
    const ik = await prisma.iK.update({
      where: { id },
      data: {
        kode,
        deskripsi,
        deskripsiEn,
        bobot: bobot ? parseFloat(bobot) : 0,
        cplId: cplId || null,
      },
    });

    // If cpmkMappings is provided, update mappings
    if (cpmkMappings && Array.isArray(cpmkMappings)) {
      // Clear existing mappings for this IK
      await prisma.cpmkIkMapping.deleteMany({
        where: { ikId: id }
      });

      // Create new mappings
      if (cpmkMappings.length > 0) {
        await prisma.cpmkIkMapping.createMany({
          data: cpmkMappings.map((m: any) => ({
            ikId: id,
            cpmkId: m.cpmkId,
            bobot: parseFloat(m.bobot) || 0
          }))
        });
      }
    }

    return NextResponse.json(ik);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Kode IK sudah digunakan' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.iK.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
