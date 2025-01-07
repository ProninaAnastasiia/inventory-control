import Link from 'next/link';

export default function Header() {
  return (
    <header className="mb-2 flex items-center justify-between bg-blue-300 bg-opacity-20 px-4 py-4">
      <nav>
        <ul className="flex space-x-6">
          <Link href="/" className="font-bold hover:text-blue-500">
            <h2>Sales Manager</h2>
          </Link>
          {/* shared */}
          <li>
            <a href="/profile" className="hover:text-blue-500">
              Профиль
            </a>
          </li>
          {/* admin */}
          <li>
            <a href="/products" className="hover:text-blue-500">
              Учет товаров
            </a>
          </li>
          {/* admin */}
          <li>
            <a href="/orders" className="hover:text-blue-500">
              Текущие заказы
            </a>
          </li>
          {/* client */}
          <li>
            <a href="/catalog" className="hover:text-blue-500">
              Каталог
            </a>
          </li>
          <li>
            <a href="/orders" className="hover:text-blue-500">
              Мои заказы
            </a>
          </li>
          <li>
            <a href="/cart" className="hover:text-blue-500">
              Корзина
            </a>
          </li>
        </ul>
      </nav>
      <nav className="flex">
        <ul className="flex space-x-6">
          <li>
            <a href="/login" className="hover:text-blue-500">
              Вход
            </a>
          </li>
          <li>
            <a href="/signup" className="hover:text-blue-500">
              Регистрация
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
