/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

import { Knex } from 'knex';

export const parts = [
  {
    name: 'کۆگا',
    created_at: new Date(),
  },
  {
    name: 'نۆرەکان',
    created_at: new Date(),
  },
  {
    name: 'پسولەکان',
    created_at: new Date(),
  },
  {
    name: 'پسولەی فرۆشتن',
    created_at: new Date(),
  },

  {
    name: 'بەکارهێنەران',
    created_at: new Date(),
  },
  {
    name: 'کڕیارەکان',
    created_at: new Date(),
  },
  {
    name: 'خەرجی',
    created_at: new Date(),
  },
  {
    name: 'ڕێکخستن',
    created_at: new Date(),
  },
  {
    name: 'مەوادی کەمبوو',
    created_at: new Date(),
  },
  {
    name: 'ڕاپۆرتی فرۆشتن',
    created_at: new Date(),
  },
  {
    name: 'ڕاپۆرتی کۆگا',
    created_at: new Date(),
  },
  {
    name: 'ڕاپۆرتی قازانج',
    created_at: new Date(),
  },
  {
    name: 'ڕاپۆرتی خەرجی',
    created_at: new Date(),
  },
  {
    name: 'ڕاپۆرتی صندوق',
    created_at: new Date(),
  },
  {
    name: 'ڕاپۆرتی نۆرەکان',
    created_at: new Date(),
  },
  {
    name: 'ڕۆڵەکان',
    created_at: new Date(),
  },
  {
    name: 'ڕەنگەکان',
    created_at: new Date(),
  },

  {
    name: 'جۆرەکانی ئۆتۆمبێل',
    created_at: new Date(),
  },
  {
    name: 'جۆرەکانی بەرهەم',
    created_at: new Date(),
  },
  {
    name: 'مۆدێلەکانی ئۆتۆمبێل',
    created_at: new Date(),
  },
  {
    name: 'داشبۆرد',
    created_at: new Date(),
  },
  {
    name: 'خزمەتگوزاریەکان',
    created_at: new Date(),
  },
  {
    name: 'جۆرەکانی خەرجی',
    created_at: new Date(),
  },
  {
    name: 'باکئەپی ئاسایی',
    created_at: new Date(),
  },
  {
    name: 'زانیاری کۆمپانیا',
    created_at: new Date(),
  },
];

const seed = async function (knex: Knex) {
  await knex('part').del();
  await knex('part').insert(parts);
};

export { seed };
