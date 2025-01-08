'use client';

import { useState, useEffect } from 'react';

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};
type Order = {
  id: string;
  status: 'pending' | 'completed';
  items: OrderItem[];
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchOrders = async () => {
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

        const ordersResponse = await fetch(`/api/user-orders/${userId}`);
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
        } else {
          console.error('Failed to fetch orders');
          setError('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  if (orders.length === 0) {
    return <p>У вас пока нет заказов.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Мои заказы</h1>
      {orders.map((order) => (
        <div key={order.id} className="mb-6 rounded border p-4 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Заказ #{order.id}</h2>
          <p className="mb-2">Статус: {order.status}</p>
          <h3 className="mb-2 font-semibold">Товары:</h3>
          {order.items.map((item, index) => (
            <div key={index} className="mb-2 ml-4">
              <p>Product ID: {item.productId}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
