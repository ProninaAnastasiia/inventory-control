'use client';

import { useState, useEffect } from 'react';
import { type Product } from '~/app/(admin)/products/page';
import { useRouter } from 'next/navigation';

type CartItem = {
  product: Product;
  quantity: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('User not authorized');
          setError('User not authorized');
          return;
        }
        const response = await fetch(`/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.error('Failed to authorize user');
          setError('Failed to authorize user');
          return;
        }
        const data = await response.json();
        const userId = data.user.id;
        const cartResponse = await fetch(`/api/cart/${userId}`);
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          const fetchedCartItems: CartItem[] = [];

          for (const item of cartData.items) {
            const productResponse = await fetch(`/api/products/${item.productId}`);
            if (productResponse.ok) {
              const product = await productResponse.json();
              fetchedCartItems.push({
                product: product,
                quantity: item.quantity,
              });
            } else {
              console.error('Failed to fetch product');
              setError('Failed to fetch product');
            }
          }
          setCartItems(fetchedCartItems);
        } else {
          console.error('Failed to fetch cart');
          setError('Failed to fetch cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Error fetching cart');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authorized');
        setError('User not authorized');
        return;
      }

      const response = await fetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error('Failed to authorize user');
        setError('Failed to authorize user');
        return;
      }

      const data = await response.json();
      const userId = data.user.id;

      const deleteResponse = await fetch(`/api/cart/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId }),
      });

      if (deleteResponse.ok) {
        setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
      } else {
        console.error('Failed to remove item from cart');
        setError('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Error removing item from cart');
    }
  };
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authorized');
        setError('User not authorized');
        return;
      }

      const response = await fetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error('Failed to authorize user');
        setError('Failed to authorize user');
        return;
      }

      const data = await response.json();
      const userId = data.user.id;

      const orderData = {
        userId: userId,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const checkoutResponse = await fetch('/api/user-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (checkoutResponse.ok) {
        setCartItems([]);
        router.push('/myorders');
      } else {
        console.error('Что-то пошло не так!');
        setError('Что-то пошло не так!');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      setError('Error processing order');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p className='p-4'>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Корзина</h1>
      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="shadow- md flex items-center justify-between rounded border p-4"
            >
              <div>
                <h3 className="mb-2 text-xl font-semibold">{item.product.name}</h3>
                <p>Цена: {item.product.price}</p>
                <p>Количество: {item.quantity}</p>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.product.id)}
                className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <button
          onClick={handleCheckout}
          className="focus:shadow-outline mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none"
        >
          Оформить заказ
        </button>
      )}
    </div>
  );
}
