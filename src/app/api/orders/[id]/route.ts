// app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { orders } from '~/server/db/schema';
import { z } from 'zod';

type Params = { params: { id: string } };

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'completed']),
});

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const validatedBody = updateOrderStatusSchema.parse(body);
    const { id } = params;

    await db.update(orders).set({ status: validatedBody.status }).where(eq(orders.id, id));

    return NextResponse.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ message: 'Error updating order status' }, { status: 500 });
  }
}
