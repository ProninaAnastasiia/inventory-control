'use client';

import { useState } from 'react';

type ProductFormProps = {
  onProductAdded: (newProduct: any) => void;
};

const ProductForm = ({ onProductAdded }: ProductFormProps) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity: Number(quantity),
          price: Number(price),
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        onProductAdded(newProduct);
        setName('');
        setQuantity('');
        setPrice('');
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="mb-2 text-xl font-semibold">Добавить новый товар</h2>
      <div className="mb-2">
        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="name">
          Название товара
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          required
        />
      </div>
      <div className="mb-2">
        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="quantity">
          Количество в наличии
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          required
        />
      </div>
      <div className="mb-2">
        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="price">
          Цена за единицу
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          required
        />
      </div>
      <button
        type="submit"
        className="focus:shadow-outline mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
      >
        Добавить товар
      </button>
    </form>
  );
};

export default ProductForm;
