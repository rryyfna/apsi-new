import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ valid: false, reason: 'Missing user ID' }, { status: 401 });
    }
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { isApproved: true }
    });
    
    if (!user) {
      return NextResponse.json({ valid: false, reason: 'User not found' }, { status: 401 });
    }
    
    if (!user.isApproved) {
      return NextResponse.json({ valid: false, reason: 'User not approved or disabled' }, { status: 401 });
    }
    
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Validate API Error:', error);
    return NextResponse.json({ valid: false, reason: 'Internal server error' }, { status: 500 });
  }
}
