import { type Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://user:123@localhost:5433/db',
  },
} satisfies Config;
