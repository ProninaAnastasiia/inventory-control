import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { carts, products } from '~/server/db/schema';

const cartItemSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = cartItemSchema.parse(body);

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, validatedBody.productId));
    if (product.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    const availableQuantity = product[0].quantity;

    const existingCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, validatedBody.userId));

    if (existingCart.length > 0) {
      const cart = existingCart[0];
      let updatedItems = cart.items as { productId: string; quantity: number }[];
      const existingItemIndex = updatedItems.findIndex(
        (item) => item.productId === validatedBody.productId,
      );

      let currentQuantityInCart = 0;
      if (existingItemIndex !== -1) {
        currentQuantityInCart = updatedItems[existingItemIndex].quantity;
      }
      const totalQuantityRequested = currentQuantityInCart + validatedBody.quantity;

      if (totalQuantityRequested > availableQuantity) {
        return NextResponse.json({ message: 'Not enough product in stock' }, { status: 400 });
      }

      if (existingItemIndex !== -1) {
        updatedItems[existingItemIndex].quantity += validatedBody.quantity;
      } else {
        updatedItems.push({ productId: validatedBody.productId, quantity: validatedBody.quantity });
      }

      await db
        .update(carts)
        .set({ items: updatedItems })
        .where(eq(carts.userId, validatedBody.userId));

      return NextResponse.json({ message: 'Cart updated' });
    } else {
      if (validatedBody.quantity > availableQuantity) {
        return NextResponse.json({ message: 'Not enough product in stock' }, { status: 400 });
      }
      await db.insert(carts).values({
        userId: validatedBody.userId,
        items: [{ productId: validatedBody.productId, quantity: validatedBody.quantity }],
      });
      return NextResponse.json({ message: 'Cart created' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ message: 'Error adding to cart', error }, { status: 500 });
  }
}
