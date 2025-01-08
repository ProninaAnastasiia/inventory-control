import { db } from '~/server/db';
import { products } from '~/server/db/schema';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const productSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().min(0),
  price: z.number().min(0),
});
type Params = { params: { id: string } };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const product = await db.select().from(products).where(eq(products.id, id));
    if (product.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product[0]);
  } catch (error) {
    console.error('Error getting product:', error);
    return NextResponse.json({ message: 'Error getting product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const validatedBody = productSchema.parse(body);

    const updatedProduct = await db
      .update(products)
      .set(validatedBody)
      .where(eq(products.id, params.id))
      .returning();

    if (updatedProduct.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: Params) {
  try {
    const deleteProduct = await db.delete(products).where(eq(products.id, params.id)).returning();
    if (deleteProduct.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}
