import me from '~/server/api/auth/me';

export async function GET(req: Request) {
  return await me(req);
}
