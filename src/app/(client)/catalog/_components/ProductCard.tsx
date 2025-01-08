'use client';

import { useState } from 'react';
import { Product } from '~/app/(admin)/products/page';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authorized');
        return;
      }

      const response = await fetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error('Failed to authorize user');
        return;
      }
      const data = await response.json();
      const userId = data.user.id;

      const cartResponse = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: product.id,
          quantity: quantityToAdd,
        }),
      });
      if (cartResponse.ok) {
        setErrorMessage(null);
        alert('Товар добавлен в корзину');
      } else {
        const errorData = await cartResponse.json();
        setErrorMessage(errorData.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setErrorMessage('Error adding to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="rounded border p-4 shadow-md">
      <h3 className="mb-2 text-xl font-semibold">{product.name}</h3>
      <p className="mb-2">Цена: {product.price}</p>
      <p className="mb-2">В наличии: {product.quantity}</p>
      <div className="mb-2 flex items-center">
        <label htmlFor="quantity" className="mr-2">
          Количество:
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          max={product.quantity}
          value={quantityToAdd}
          onChange={(e) =>
            setQuantityToAdd(Math.min(product.quantity, parseInt(e.target.value, 10)))
          }
          className="w-16 rounded border p-1 text-sm"
          required
        />
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAddingToCart ? 'Добавляю...' : 'Добавить в корзину'}
      </button>
    </div>
  );
};

export default ProductCard;
