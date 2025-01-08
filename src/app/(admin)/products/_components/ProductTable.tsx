'use client';

import { useState, useEffect } from 'react';
import { Product } from '../page';

type ProductTableProps = {
  products: Product[];
  onProductUpdated: (updatedProduct: Product) => void;
  onProductDeleted: (deletedProductId: string) => void;
  setProducts: (products: Product[]) => void;
};

const ProductTable = ({
  products,
  onProductUpdated,
  onProductDeleted,
  setProducts,
}: ProductTableProps) => {
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedPrice, setEditedPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const productsData = await response.json();
          setProducts(productsData);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const handleEdit = (product: Product) => {
    setEditProductId(product.id);
    setEditedQuantity(String(product.quantity));
    setEditedPrice(String(product.price));
  };
  const handleCancelEdit = () => {
    setEditProductId(null);
  };

  const handleSave = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          quantity: Number(editedQuantity),
          price: Number(editedPrice),
        }),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        onProductUpdated(updatedProduct);
        setEditProductId(null);
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onProductDeleted(productId);
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  return (
    <div className="overflow-x-auto">
      <h2 className="mb-2 text-xl font-semibold">Список товаров</h2>
      <table className="min-w-full border border-gray-200 bg-white">
        <thead>
          <tr>
            <th className="border p-2">Название</th>
            <th className="border p-2">Количество</th>
            <th className="border p-2">Цена</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">
                {editProductId === product.id ? (
                  <input
                    type="number"
                    value={editedQuantity}
                    onChange={(e) => setEditedQuantity(e.target.value)}
                    className="focus:shadow-outline w-full appearance-none rounded border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
                  />
                ) : (
                  product.quantity
                )}
              </td>
              <td className="border p-2">
                {editProductId === product.id ? (
                  <input
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                    className="focus:shadow-outline w-full appearance-none rounded border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
                  />
                ) : (
                  product.price
                )}
              </td>
              <td className="border p-2">
                {editProductId === product.id ? (
                  <>
                    <button
                      onClick={() => handleSave(product)}
                      className="focus:shadow-outline mr-1 rounded bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700 focus:outline-none"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="focus:shadow-outline rounded bg-gray-400 px-2 py-1 font-bold text-white hover:bg-gray-500 focus:outline-none"
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(product)}
                      className="focus:shadow-outline mr-1 rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700 focus:outline-none"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="focus:shadow-outline rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700 focus:outline-none"
                    >
                      Удалить
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
