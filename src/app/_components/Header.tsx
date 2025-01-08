'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [menuItems, setMenuItems] = useState<{ href: string; label: string }[]>([]);
  const [authItems, setAuthItems] = useState<{ href: string; label: string }[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        let newMenuItems: { href: string; label: string }[] = [];
        let newAuthItems: { href: string; label: string }[] = [];
        if (!token) {
          newMenuItems = [];
          newAuthItems = [
            { href: '/login', label: 'Вход' },
            { href: '/signup', label: 'Регистрация' },
          ];
          setMenuItems(newMenuItems);
          setAuthItems(newAuthItems);
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();

          if (data.user.email === 'admin@mail.ru') {
            newMenuItems = [
              { href: '/profile', label: 'Профиль' },
              { href: '/products', label: 'Учет товаров' },
              { href: '/orders', label: 'Текущие заказы' },
            ];
          } else {
            newMenuItems = [
              { href: '/profile', label: 'Профиль' },
              { href: '/catalog', label: 'Каталог' },
              { href: '/myorders', label: 'Мои заказы' },
              { href: '/cart', label: 'Корзина' },
            ];
          }
          newAuthItems = [
            { href: '/profile', label: data.user.email },
            { href: '#', label: 'Выход' }
          ];
        } else if (response.status === 401) {
          handleLogout();
          return;
        } else {
          newMenuItems = [];
          newAuthItems = [
            { href: '/login', label: 'Вход' },
            { href: '/signup', label: 'Регистрация' },
          ];
        }
        setMenuItems(newMenuItems);
        setAuthItems(newAuthItems);
      } catch (error) {
        setMenuItems([]);
        setAuthItems([
          { href: '/login', label: 'Вход' },
          { href: '/signup', label: 'Регистрация' },
        ]);
      }
    };
    checkAuth();
  }, []);

  return (
    <header className="mb-2 flex items-center justify-between bg-blue-300 bg-opacity-20 px-4 py-4">
      <nav>
        <ul className="flex space-x-6">
          <Link href="/" className="font-bold hover:text-blue-500">
            <h2>Sales Manager</h2>
          </Link>
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="hover:text-blue-500">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="flex">
        <ul className="flex space-x-6">
          {authItems.map((item) => (
            <li key={item.label}>
              {item.label === 'Выход' ? (
                <button onClick={handleLogout} className="hover:text-blue-500">
                  {item.label}
                </button>
              ) : (
                <Link href={item.href} className="hover:text-blue-500">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
