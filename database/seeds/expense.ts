/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { faker } from '@faker-js/faker';
import { Knex } from 'knex';

const seed = async function (knex: Knex) {
  const expenseTypes = await knex.table('expense_type').select('id');

  const expenses = Array.from({ length: 10 }, () => ({
    price: faker.number.int({ min: 1, max: 1000 }),
    type_id: faker.helpers.arrayElement(expenseTypes).id, // Randomly assign an expense type
    created_by: 1,

    date: faker.date.anytime(),
    note: faker.lorem.sentence(), // More appropriate for a note
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await knex('expense').del();
  await knex('expense').insert(expenses);
};

export { seed };
