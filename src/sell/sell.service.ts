import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Item, Sell, SellItem } from 'database/types';
import { Knex } from 'knex';
import {
  Filter,
  From,
  Id,
  Limit,
  Page,
  PaginationReturnType,
  Search,
  To,
} from 'src/types/global';
import { UpdateSellDto } from './dto/update-sell.dto';
import { AddItemToSellDto } from './dto/add-item-to-sell.dto';
import { UpdateItemToSellDto } from './dto/update-item-to-sell';
import { ItemService } from 'src/item/item.service';
import { generatePaginationInfo, timestampToDateString } from 'lib/functions';
import { RestoreSellDto } from './dto/restore-sell.dto';

@Injectable()
export class SellService {
  constructor(
    @Inject('KnexConnection') private readonly knex: Knex,
    private itemService: ItemService,
  ) {}

  async getAll(
    page: Page,
    limit: Limit,
    userFilter: Filter,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<Sell[]>> {
    try {
      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id')
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id')
        .offset((page - 1) * limit)
        .where('sell.deleted', false)
        .andWhere(function () {
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('sell.created_at', [fromDate, toDate]);
          }
        })
        .andWhere(function () {
          if (userFilter != '' && userFilter) {
            this.where('createdUser.id', userFilter).orWhere(
              'updatedUser.id',
              userFilter,
            );
          }
        })
        .limit(limit)
        .orderBy('sell.id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Sell>(
        this.knex<Sell>('sell'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: sells,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: sells.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDeleted(
    page: Page,
    limit: Limit,
    userFilter: Filter,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<Sell[]>> {
    try {
      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id')
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id')
        .offset((page - 1) * limit)
        .where('sell.deleted', true)
        .andWhere(function () {
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('sell.created_at', [fromDate, toDate]);
          }
        })
        .andWhere(function () {
          if (userFilter != '' && userFilter) {
            this.where('createdUser.id', userFilter).orWhere(
              'updatedUser.id',
              userFilter,
            );
          }
        })
        .limit(limit)
        .orderBy('sell.id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Sell>(
        this.knex<Sell>('sell'),
        page,
        limit,
        true,
      );
      return {
        paginatedData: sells,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: sells.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async search(search: Search): Promise<Sell[]> {
    try {
      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id')
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id')
        .where(function () {
          this.whereRaw('CAST(sell.id AS TEXT) ILIKE ?', [`%${search}%`]);
        })
        .andWhere('sell.deleted', false)
        .limit(30);

      return sells;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<Sell[]> {
    try {
      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id')
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id')
        .where(function () {
          this.whereRaw('CAST(sell.id AS TEXT) ILIKE ?', [`%${search}%`]);
        })
        .andWhere('sell.deleted', true)
        .limit(30);

      return sells;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOne(id: Id): Promise<Sell> {
    try {
      const sell: Sell = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id')
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id')
        .where('sell.id', id)
        .andWhere('sell.deleted', false)
        .first();

      return sell;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSellItems(sell_id: Id): Promise<SellItem[]> {
    try {
      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select(
          'sell_item.*',
          'item.id as item_id',
          'item.name as item_name',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .leftJoin(
          'user as createdUser',
          'sell_item.created_by',
          'createdUser.id',
        )
        .leftJoin(
          'user as updatedUser',
          'sell_item.updated_by',
          'updatedUser.id',
        )
        .where('sell_item.sell_id', sell_id)
        .andWhere('sell_item.deleted', false)
        .andWhere('sell_item.self_deleted', false)
        .orderBy('sell_item.id', 'asc');
      return sellItems;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDeletedSellItems(
    sell_id: Id,
    userFilter: Filter,
  ): Promise<SellItem[]> {
    try {
      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select(
          'sell_item.*',
          'item.id as item_id',
          'item.name as item_name',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .leftJoin(
          'user as createdUser',
          'sell_item.created_by',
          'createdUser.id',
        )
        .leftJoin(
          'user as updatedUser',
          'sell_item.updated_by',
          'updatedUser.id',
        )
        .where('sell_item.sell_id', sell_id)
        .andWhere('sell_item.deleted', true)
        .andWhere('sell_item.self_deleted', true)
        .andWhere(function () {
          if (userFilter != '' && userFilter) {
            this.where('createdUser.id', userFilter).orWhere(
              'updatedUser.id',
              userFilter,
            );
          }
        });

      return sellItems;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSelfDeletedSellItems(
    page: Page,
    limit: Limit,
    userFilter: Filter,
  ): Promise<PaginationReturnType<SellItem[]>> {
    try {
      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select(
          'sell_item.*',
          'item.id as item_id',
          'item.name as item_name',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .leftJoin(
          'user as createdUser',
          'sell_item.created_by',
          'createdUser.id',
        )
        .leftJoin(
          'user as updatedUser',
          'sell_item.updated_by',
          'updatedUser.id',
        )
        .andWhere('sell_item.deleted', false)
        .andWhere('sell_item.self_deleted', true)
        .andWhere(function () {
          if (userFilter != '' && userFilter) {
            this.where('createdUser.id', userFilter).orWhere(
              'updatedUser.id',
              userFilter,
            );
          }
        })
        .offset((page - 1) * limit)
        .limit(limit);

      const { hasNextPage } = await generatePaginationInfo<SellItem>(
        this.knex<SellItem>('sell_item'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: sellItems,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: sellItems.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async searchSelfDeletedSellItems(search: Search): Promise<SellItem[]> {
    try {
      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select(
          'sell_item.*',
          'item.id as item_id',
          'item.name as item_name',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .leftJoin(
          'user as createdUser',
          'sell_item.created_by',
          'createdUser.id',
        )
        .leftJoin(
          'user as updatedUser',
          'sell_item.updated_by',
          'updatedUser.id',
        )
        .andWhere('sell_item.deleted', false)
        .andWhere('sell_item.self_deleted', true)
        .andWhere(function () {
          this.whereRaw('CAST(sell_id AS TEXT) ILIKE ?', [`%${search}%`]);
        });
      return sellItems;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async create(user_id: number): Promise<Sell> {
    try {
      const sell: Sell[] = await this.knex<Sell>('sell')
        .insert({
          date: new Date(),
          discount: 0,
          created_by: user_id,
        })
        .returning('*');

      return sell[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async print(sell_id: Id): Promise<{
    sell: Sell;
    sellItems: SellItem[];
  }> {
    try {
      let sell: Sell = await this.findOne(sell_id);

      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select('sell_item.*', 'item.id as item_id', 'item.name as item_name')
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .where('sell_item.sell_id', sell_id)
        .andWhere('sell_item.deleted', false);

      if (sellItems.length > 0) {
        return {
          sell,
          sellItems,
        };
      } else {
        throw new BadRequestException('مواد داخڵ کە بۆ سەر وەصڵ');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addItemToSell(
    sell_id: Id,
    body: AddItemToSellDto,
    user_id: number,
  ): Promise<SellItem> {
    try {
      let actualItemId;
      if (body.barcode) {
        let item = await this.knex<Item>('item')
          .where('barcode', body.item_id)
          .first();
        if (!item) {
          throw new BadRequestException('ئەم مەوادە لە کۆگا نیە');
        } else {
          actualItemId = item.id;
        }
      } else {
        actualItemId = body.item_id;
      }
      let itemQuantity = await this.itemService.getItemQuantity(
        Number(actualItemId),
      );
      if (1 > itemQuantity.actual_quantity) {
        throw new BadRequestException(
          'ناتوانی ئەم عددە زیادکەی، بڕی پێویست نیە لە کۆگا',
        );
      }
      let initialSell: Sell;
      let actual_id: Id;
      if (sell_id == 0) {
        initialSell = await this.create(user_id);
        actual_id = initialSell.id;
      } else {
        actual_id = sell_id;
      }

      let exists = await this.knex<SellItem>('sell_item')
        .where('sell_id', actual_id)
        .andWhere('item_id', Number(actualItemId))
        .andWhere('deleted', false)
        .first();

      if (exists) {
        return this.increaseItemInSell(sell_id, Number(actualItemId), user_id);
      }
      let item: Pick<Item, 'id' | 'item_purchase_price' | 'item_sell_price'> =
        await this.knex<Item>('item')
          .select('id', 'item_purchase_price', 'item_sell_price')
          .where('id', actualItemId)
          .first();
      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .insert({
          sell_id: actual_id,
          item_id: Number(actualItemId),
          created_by: user_id,
          quantity: 1,
          item_purchase_price: item.item_purchase_price,
          item_sell_price: item.item_sell_price,
        })
        .returning('*');

      return sellItem[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateItemInSell(
    sell_id: Id,
    item_id: Id,
    body: UpdateItemToSellDto,
    user_id: number,
  ): Promise<SellItem> {
    try {
      let itemQuantity = await this.itemService.getItemQuantity(item_id);
      if (body.quantity > itemQuantity.actual_quantity) {
        throw new BadRequestException(
          'ناتوانی ئەم عددە زیادکەی، بڕی پێویست نیە لە کۆگا',
        );
      }
      let prevQuantity: Pick<SellItem, 'id' | 'quantity'> =
        await this.knex<SellItem>('sell_item')
          .where('sell_id', sell_id)
          .andWhere('item_id', item_id)
          .andWhere('deleted', false)
          .andWhere('self_deleted', false)
          .first();
      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .where('sell_id', sell_id)
        .andWhere('item_id', item_id)
        .andWhere('deleted', false)
        .andWhere('self_deleted', false)
        .update({
          quantity: Number(prevQuantity.quantity) + Number(body.quantity),
          updated_by: user_id,
        })
        .returning('*');

      return sellItem[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async increaseItemInSell(
    sell_id: Id,
    item_id: Id,
    user_id: number,
  ): Promise<SellItem> {
    try {
      let itemQuantity = await this.itemService.getItemQuantity(item_id);
      if (itemQuantity.actual_quantity == 0) {
        throw new BadRequestException(
          'ناتوانی ئەم عددە زیادکەی، بڕی پێویست نیە لە کۆگا',
        );
      }
      let previousItemData: Pick<SellItem, 'id' | 'quantity'> =
        await this.knex<SellItem>('sell_item')
          .select('id', 'quantity')
          .where('sell_id', sell_id)
          .andWhere('item_id', item_id)
          .andWhere('deleted', false)
          .andWhere('self_deleted', false)
          .first();

      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .where('sell_id', sell_id)
        .andWhere('item_id', item_id)
        .andWhere('deleted', false)
        .andWhere('self_deleted', false)
        .update({
          quantity: Number(previousItemData.quantity) + 1,
          updated_by: user_id,
        })
        .returning('*');

      return sellItem[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async decreaseItemInSell(
    sell_id: Id,
    item_id: Id,
    user_id: number,
  ): Promise<SellItem> {
    try {
      let itemQuantity = await this.itemService.getItemQuantity(item_id);
      if (itemQuantity.actual_quantity == 0) {
        throw new BadRequestException(
          'ناتوانی ئەم عددە زیادکەی، بڕی پێویست نیە لە کۆگا',
        );
      }
      let previousItemData: Pick<SellItem, 'id' | 'quantity'> =
        await this.knex<SellItem>('sell_item')
          .select('id', 'quantity')
          .where('sell_id', sell_id)
          .andWhere('item_id', item_id)
          .andWhere('deleted', false)
          .andWhere('self_deleted', false)

          .first();

      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .where('sell_id', sell_id)
        .andWhere('item_id', item_id)
        .andWhere('deleted', false)
        .andWhere('self_deleted', false)

        .update({
          quantity: Number(previousItemData.quantity) - 1,
          updated_by: user_id,
        })
        .returning('*');

      return sellItem[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteItemInSell(sell_id: Id, item_id: Id): Promise<Id> {
    try {
      await this.knex<SellItem>('sell_item')
        .where('sell_id', sell_id)
        .andWhere('item_id', item_id)
        .andWhere('self_deleted', false)
        .update({ self_deleted: true });

      return item_id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async update(id: Id, body: UpdateSellDto, user_id: number): Promise<Sell> {
    try {
      let prevSellPrice: { total_sell_price: number | string } =
        await this.knex<SellItem>('sell_item')
          .where('sell_id', id)
          .sum({
            total_sell_price: this.knex.raw('item_sell_price * quantity'),
          })
          .first();

      if (
        Number(body.discount) > Number(prevSellPrice.total_sell_price) ||
        Number(body.discount) < 0
      ) {
        throw new BadRequestException('تکایە بڕێ داشکاندنی ڕاست و دروست بنێرە');
      }
      const sell: Sell[] = await this.knex<Sell>('sell')
        .where('id', id)
        .andWhere('deleted', false)
        .update({ discount: Number(body.discount), updated_by: user_id })
        .returning('*');

      if (!sell) {
        throw new BadRequestException(`تکایە سەرەتا وەصڵ دروست بکە`);
      }

      return sell[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async delete(id: Id): Promise<Id> {
    try {
      await this.knex<Sell>('sell').where('id', id).update({ deleted: true });
      await this.knex<SellItem>('sell_item')
        .where('sell_id', id)
        .update({ deleted: true, self_deleted: true });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restore(id: Id, body: RestoreSellDto): Promise<Id> {
    try {
      await this.knex<Sell>('sell').where('id', id).update({ deleted: false });
      // Restore only the selected sell_items based on the provided item_ids
      if (body.item_ids && body.item_ids.length > 0) {
        await this.knex<SellItem>('sell_item')
          .whereIn('item_id', body.item_ids)
          .andWhere('sell_id', id)
          .update({ deleted: false, self_deleted: false });
      }
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restoreSelfDeletedSellItem(id: Id): Promise<Id> {
    try {
      await this.knex<SellItem>('sell_item')
        .where('item_id', id)
        .update({ deleted: false, self_deleted: false });

      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
