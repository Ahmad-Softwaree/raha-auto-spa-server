import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BackupService } from './backup.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';

import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';
import { Request, Response } from 'express';
import {
  Filter,
  From,
  Limit,
  Page,
  PaginationReturnType,
  To,
} from 'src/types/global';
import {
  Backup,
  BackupWithUser,
  CarModel,
  CarType,
  Color,
  Config,
  Customer,
  Expense,
  ExpenseType,
  Item,
  ItemQuantityHistory,
  ItemType,
  Reservation,
  Role,
  Sell,
  SellItem,
  Service,
  User,
} from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/table_names')
  async getTableNames(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<string[]>> {
    try {
      let data: string[] = await this.backupService.getTableNames();
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/all_table')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<BackupWithUser[]>>> {
    try {
      let data: PaginationReturnType<BackupWithUser[]> =
        await this.backupService.getAll(page, limit, filter, from, to);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/user')
  async backupUsers(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<User[]>> {
    try {
      let data: User[] = await this.backupService.backupUsers(req['user'].id);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="users_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/customer')
  async backupCustomers(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Customer[]>> {
    try {
      let data: Customer[] = await this.backupService.backupCustomers(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="customers_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/reservation')
  async backupReservations(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Reservation[]>> {
    try {
      let data: Reservation[] = await this.backupService.backupReservations(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="reservations_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/item')
  async backupItems(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Item[]>> {
    try {
      let data: Item[] = await this.backupService.backupItems(req['user'].id);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="items_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/sell')
  async backupSells(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Sell[]>> {
    try {
      let data: Sell[] = await this.backupService.backupSells(req['user'].id);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="sells_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/sell_item')
  async backupSellItems(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<SellItem[]>> {
    try {
      let data: SellItem[] = await this.backupService.backupSellItems(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="sell_items_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/expense')
  async backupExpenses(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Expense[]>> {
    try {
      let data: Expense[] = await this.backupService.backupExpenses(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="expenses_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/role')
  async backupRoles(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Role[]>> {
    try {
      let data: Role[] = await this.backupService.backupRoles(req['user'].id);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="roles_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/color')
  async backupColors(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Color[]>> {
    try {
      let data: Color[] = await this.backupService.backupColors(req['user'].id);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="colors_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/car_type')
  async backupCarTypes(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CarType[]>> {
    try {
      let data: CarType[] = await this.backupService.backupCarTypes(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="car_types_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/car_model')
  async backupCarModels(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CarModel[]>> {
    try {
      let data: CarModel[] = await this.backupService.backupCarModels(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="car_models_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/expense_type')
  async backupExpenseTypes(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ExpenseType[]>> {
    try {
      let data: ExpenseType[] = await this.backupService.backupExpenseTypes(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="expense_types_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/item_type')
  async backupItemTypes(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ItemType[]>> {
    try {
      let data: ItemType[] = await this.backupService.backupItemTypes(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="item_types_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/service')
  async backupServices(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Service[]>> {
    try {
      let data: Service[] = await this.backupService.backupServices(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="services_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/item_quantity_history')
  async backupItemQuantityHistories(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ItemQuantityHistory[]>> {
    try {
      let data: ItemQuantityHistory[] =
        await this.backupService.backupItemQuantityHistories(req['user'].id);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="item_quantity_histories_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.NORMAL_BACKUP_PART as string])
  @Get('/config')
  async backupConfigs(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Config[]>> {
    try {
      let data: Config[] = await this.backupService.backupConfigs(
        req['user'].id,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="configs_backup.json"',
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(HttpStatus.OK).send(JSON.stringify(data, null, 2));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
