import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { orders } from '~/server/db/schema';

type Params = { params: { userId: string } };

export async function GET(request: Request, { params }: Params) {
  try {
    const { userId } = params;
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));

    return NextResponse.json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ message: 'Error fetching user orders' }, { status: 500 });
  }
}
