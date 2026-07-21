import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Costing from '@/models/Costing';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const costing = await Costing.findById(id).lean();
    if (!costing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: costing });
  } catch (error) {
    console.error('GET /api/costings/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch costing' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const costing = await Costing.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!costing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: costing });
  } catch (error) {
    console.error('PUT /api/costings/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update costing' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const costing = await Costing.findByIdAndDelete(id);
    if (!costing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/costings/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete costing' }, { status: 500 });
  }
}
