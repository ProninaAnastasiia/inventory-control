import { sql } from 'drizzle-orm';
import {
  index,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  numeric,
  json,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => name);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'completed']);

export const users = createTable(
  'users',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (users) => ({
    emailIndex: index('email_idx').on(users.email),
  }),
);

export const products = createTable('products', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  name: varchar('name', { length: 256 }).notNull(),
  quantity: integer('quantity').notNull(),
  price: numeric('price').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
});

export const carts = createTable(
  'carts',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
    userId: uuid('user_id').notNull(),
    items: json('items').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (carts) => ({
    userIdIndex: index('cart_user_id_idx').on(carts.userId),
  }),
);

export const orders = createTable(
  'orders',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
    userId: uuid('user_id').notNull(),
    items: json('items').notNull(),
    status: orderStatusEnum('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (orders) => ({
    userIdIndex: index('order_user_id_idx').on(orders.userId),
  }),
);
