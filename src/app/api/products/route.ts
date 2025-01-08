import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '~/server/db';
import { products } from '~/server/db/schema';

const productSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().min(0),
  price: z.number().min(0),
});

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error getting products:', error);
    return NextResponse.json({ message: 'Error getting products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = productSchema.parse(body);
    const newProduct = await db
      .insert(products)
      .values({
        ...validatedBody,
        price: String(validatedBody.price),
      })
      .returning();
    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Error creating product', error }, { status: 500 });
  }
}
