import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Costing from '@/models/Costing';

export async function GET() {
  try {
    await dbConnect();
    const costings = await Costing.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: costings });
  } catch (error) {
    console.error('GET /api/costings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch costings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const costing = await Costing.create(body);
    return NextResponse.json({ success: true, data: costing }, { status: 201 });
  } catch (error) {
    console.error('POST /api/costings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create costing' }, { status: 500 });
  }
}
