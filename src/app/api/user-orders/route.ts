import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { carts, orders, products } from '~/server/db/schema';

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().min(1),
});

const createOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(orderItemSchema),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = createOrderSchema.parse(body);

    const cart = await db.select().from(carts).where(eq(carts.userId, validatedBody.userId));

    if (cart.length === 0) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    if (cart[0].items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }
    const cartItems = cart[0].items as { productId: string; quantity: number }[];

    const productIds = cartItems.map((item) => item.productId);
    const productsInDb = await db.select().from(products).where(eq(products.id, productIds[0]));

    if (productsInDb.length === 0) {
      return NextResponse.json({ message: 'Products not found' }, { status: 404 });
    }

    for (const cartItem of cartItems) {
      const product = productsInDb.find((p) => p.id === cartItem.productId);

      if (!product) {
        return NextResponse.json(
          { message: `Product with ID ${cartItem.productId} not found` },
          { status: 404 },
        );
      }

      if (product.quantity < cartItem.quantity) {
        return NextResponse.json(
          {
            message: `Not enough stock for product ${product.name}`,
          },
          { status: 400 },
        );
      }
    }
    await db.transaction(async (tx) => {
      for (const cartItem of cartItems) {
        const product = productsInDb.find((p) => p.id === cartItem.productId);

        if (product) {
          await tx
            .update(products)
            .set({ quantity: product.quantity - cartItem.quantity })
            .where(eq(products.id, cartItem.productId));
        }
      }
      await tx.insert(orders).values({
        userId: validatedBody.userId,
        items: cartItems,
        status: 'pending',
      });
      await tx.update(carts).set({ items: [] }).where(eq(carts.userId, validatedBody.userId));
    });

    return NextResponse.json({ message: 'Order created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}