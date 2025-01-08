'use client';
import { useState } from 'react';

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Успешная регистрация!');
        window.location.href = '/';
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (e) {
      setError('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-4 max-w-md px-8 pb-8 pt-6">
      <h1 className="text-center text-2xl font-bold">Регистрация</h1>

      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-bold">
          Имя:
        </label>
        <input
          type="text"
          id="user-name"
          name="name"
          required
          placeholder="Введите имя"
          className="w-full appearance-none rounded border px-3 py-2 leading-tight focus:bg-blue-500 focus:bg-opacity-10 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-sm font-bold">
          Email:
        </label>
        <input
          type="email"
          id="user-email"
          name="email"
          required
          placeholder="Введите email"
          className="w-full appearance-none rounded border px-3 py-2 leading-tight focus:bg-blue-500 focus:bg-opacity-10 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="mb-2 block text-sm font-bold">
          Пароль:
        </label>
        <input
          type="password"
          id="user-password"
          name="password"
          required
          placeholder="Введите пароль"
          className="w-full appearance-none rounded border px-3 py-2 leading-tight focus:bg-blue-500 focus:bg-opacity-10 focus:outline-none"
        />
      </div>

      {error && <p className="absolute -translate-y-6 text-red-500">{error}</p>}
      {success && <p className="absolute -translate-y-6 text-green-500">{success}</p>}

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-blue-500"
        >
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
}
