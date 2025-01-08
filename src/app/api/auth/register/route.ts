import register from '~/server/api/auth/signup';

export async function POST(req: Request) {
  return await register(req);
}
