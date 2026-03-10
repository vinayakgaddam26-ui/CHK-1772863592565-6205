import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Emission from '@/models/Emission';

export async function GET() {
  try {
    await dbConnect();
    // Hotspots defined as totalEmissions > 200
    const hotspots = await Emission.find({ totalEmissions: { $gt: 200 } }).sort({ totalEmissions: -1 }).limit(20);
    return NextResponse.json({ success: true, data: hotspots }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
