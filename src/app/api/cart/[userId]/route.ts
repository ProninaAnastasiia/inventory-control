import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { carts } from '~/server/db/schema';
import { z } from 'zod';

type Params = { params: { userId: string } };

const removeCartItemSchema = z.object({
  productId: z.string().uuid(),
});
export async function GET(request: Request, { params }: Params) {
  try {
    const { userId } = params;
    const cart = await db.select().from(carts).where(eq(carts.userId, userId));
    if (cart.length === 0) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(cart[0]);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ message: 'Error fetching cart' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const validatedBody = removeCartItemSchema.parse(body);
    const { userId } = params;
    const existingCart = await db.select().from(carts).where(eq(carts.userId, userId));

    if (existingCart.length === 0) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    const cart = existingCart[0];
    let updatedItems = cart.items as { productId: string; quantity: number }[];
    updatedItems = updatedItems.filter((item) => item.productId !== validatedBody.productId);

    await db.update(carts).set({ items: updatedItems }).where(eq(carts.userId, userId));
    return NextResponse.json({ message: 'item deleted' });
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    return NextResponse.json({ message: 'Error deleting item from cart' }, { status: 500 });
  }
}
