'use client';

import { useState, useEffect } from 'react';

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  userId: string;
  status: 'pending' | 'completed';
  items: OrderItem[];
};

export default function AdminOrdersPage() {
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
        if (data.user.email !== 'admin@mail.ru') {
          console.error('User is not admin');
          setError('User is not admin');
          return;
        }
        const ordersResponse = await fetch(`/api/orders`);
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

  const handleCompleteOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'completed' } : order,
          ),
        );
        console.log('Order status updated');
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error updating order status');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Текущие заказы</h1>
      {orders
        .filter((order) => order.status === 'pending')
        .map((order) => (
          <div key={order.id} className="mb-6 rounded border p-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Заказ #{order.id}</h2>
            <p className="mb-2">ID пользователя: {order.userId}</p>
            <p className="mb-2">Статус: {order.status}</p>
            <h3 className="mb-2 font-semibold">Товары:</h3>
            {order.items.map((item, index) => (
              <div key={index} className="mb-2 ml-4">
                <p>Product ID: {item.productId}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.price}</p>
              </div>
            ))}
            <button
              onClick={() => handleCompleteOrder(order.id)}
              className="focus:shadow-outline mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none"
            >
              Выполнено
            </button>
          </div>
        ))}
    </div>
  );
}
