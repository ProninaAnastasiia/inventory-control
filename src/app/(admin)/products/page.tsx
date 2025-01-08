'use client';

import { useState } from 'react';
import ProductForm from './_components/ProductForm';
import ProductTable from './_components/ProductTable';

export type Product = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const handleProductAdded = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
    );
  };
  const handleProductDeleted = (deletedProductId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== deletedProductId),
    );
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Учет товаров</h1>
      <ProductForm onProductAdded={handleProductAdded} />
      <ProductTable
        products={products}
        onProductUpdated={handleProductUpdated}
        onProductDeleted={handleProductDeleted}
        setProducts={setProducts}
      />
    </div>
  );
}
