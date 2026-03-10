import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, message: 'Seeded in-memory mock data successfully' }, { status: 200 });
}
