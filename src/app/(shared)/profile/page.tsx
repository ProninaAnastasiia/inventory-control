'use client';

import { useEffect, useState } from 'react';

export default function Profile() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setName(data.user.name);
          setEmail(data.user.email);
        } else if (response.status === 401) {
          handleLogout();
          return;
        } else {
          setError('Failed to fetch profile data');
        }
      } catch (e) {
        console.error(e);
        setError('Something went wrong');
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
      <h1 className="m-4 text-center font-bold">Данные профиля</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className="p-4 font-bold">Имя пользователя: {name ? name : '...'}</div>
          <div className="p-4 font-bold">Email: {email ? email : '...'}</div>
        </div>
      )}
    </div>
  );
}
