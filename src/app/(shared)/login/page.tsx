export default function Login() {
  return (
    <form action="/login" method="post" className="mx-auto mb-4 max-w-md px-8 pb-8 pt-6">
      <h1 className="text-center text-2xl font-bold">Вход</h1>

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
          className="w-full appearance-none rounded border px-3 py-2 leading-tight focus:bg-blue-500 focus:bg-opacity-10"
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
          className="w-full appearance-none rounded border px-3 py-2 leading-tight focus:bg-blue-500 focus:bg-opacity-10"
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-blue-500"
        >
          Войти
        </button>
      </div>
    </form>
  );
}
