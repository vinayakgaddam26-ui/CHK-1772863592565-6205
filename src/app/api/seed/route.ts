import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    
    let admin = await User.findOne({ name: 'admin' });
    
    if (admin) {
      return NextResponse.json({ success: true, message: 'Admin already exists', admin });
    }
    
    const hashedPassword = await bcrypt.hash('admin', 10);
    admin = await User.create({
      name: 'admin',
      email: 'admin@carboneye.io',
      password: hashedPassword,
      role: 'admin'
    });
    
    return NextResponse.json({ success: true, message: 'Created Admin user!', admin });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
