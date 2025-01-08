import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { orders } from '~/server/db/schema';

export async function GET(request: Request) {
  try {
    const userOrders = await db.select().from(orders);
    return NextResponse.json(userOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
