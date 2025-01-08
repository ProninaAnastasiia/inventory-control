import login from '~/server/api/auth/login';

export async function POST(req: Request) {
  return await login(req);
}
