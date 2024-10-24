import { Knex } from 'knex';
import { Limit, Page } from 'src/types/global';

export const generatePaginationInfo = async <T>(
  table: Knex.QueryBuilder<T>,
  page: Page,
  limit: Limit,
  deleted: boolean,
  reservation?: boolean,
  year?: number,
  month?: number,
  day?: number,
): Promise<{
  total: number;
  hasNextPage: boolean;
}> => {
  const totalItems = deleted
    ? !reservation
      ? await table.where('deleted', true).count({ count: '*' }).first()
      : await table
          .where('deleted', true)
          .count({ count: '*' })
          .andWhere(function () {
            // Filtering by month and year
            this.whereRaw('EXTRACT(YEAR FROM reservation.date_time) = ?', [
              year,
            ])
              .andWhereRaw('EXTRACT(MONTH FROM reservation.date_time) = ?', [
                month,
              ])
              .andWhereRaw('EXTRACT(DAY FROM reservation.date_time) = ?', [
                day,
              ]);
          })
          .first()
    : !reservation
      ? await table.where('deleted', false).count({ count: '*' }).first()
      : await table
          .where('deleted', false)
          .count({ count: '*' })
          .andWhere(function () {
            // Filtering by month and year
            this.whereRaw('EXTRACT(YEAR FROM reservation.date_time) = ?', [
              year,
            ]).andWhereRaw('EXTRACT(MONTH FROM reservation.date_time) = ?', [
              month,
            ]);
          })
          .first();
  const total = parseInt(totalItems.count as string, 10);
  const hasNextPage = page * limit < total;
  return { total, hasNextPage };
};

export function formatTimestampToDate(timestamp: number): string {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString('en-GB');
  return formattedDate;
}

export function timestampToDateString(timestamp: number): string {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);
  // Extract year, month, and day from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  // Format the date string as YYYY-MM-DD
  return `${year}-${month}-${day}`;
}
export function formatDateToDDMMYY(dateString: string): string {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear());
  return `${day}/${month}/${year}`;
}
export function formateDateToYMDHM(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const year = date.getFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  // Format the date string
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatMoney(value: any): string {
  if (isNaN(value) || !value) {
    return '0';
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
