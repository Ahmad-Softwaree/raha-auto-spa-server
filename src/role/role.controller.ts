import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Request, Response } from 'express';

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
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';

import { RoleWithItsParts } from 'src/types/role-part';
import CreateRoleDto from './dto/create-role.dto';
import UpdateRoleDto from './dto/update-role.dto';
import { Role } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @PartName([ENUMs.ROLES_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<RoleWithItsParts[]>>> {
    try {
      let roles: PaginationReturnType<RoleWithItsParts[]> =
        await this.roleService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(roles);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName(['all'])
  @Get('/select')
  async getSelect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<RoleWithItsParts[]>> {
    try {
      let roles: RoleWithItsParts[] = await this.roleService.getSelect();
      return res.status(HttpStatus.OK).json(roles);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ROLES_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<RoleWithItsParts[]>>> {
    try {
      let roles: PaginationReturnType<RoleWithItsParts[]> =
        await this.roleService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(roles);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ROLES_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<RoleWithItsParts[]>> {
    try {
      let roles: RoleWithItsParts[] = await this.roleService.search(search);
      return res.status(HttpStatus.OK).json(roles);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ROLES_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<RoleWithItsParts[]>> {
    try {
      let roles: RoleWithItsParts[] =
        await this.roleService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(roles);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.ROLES_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateRoleDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Role>> {
    try {
      const role: Role = await this.roleService.create(body);
      return res.status(HttpStatus.OK).json(role);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.ROLES_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const role: Id = await this.roleService.restore(id);
      return res.status(HttpStatus.OK).json(role);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.ROLES_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateRoleDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Role>> {
    try {
      const role: Role = await this.roleService.update(id, body);
      return res.status(HttpStatus.OK).json(role);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.ROLES_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const role: Id = await this.roleService.delete(id);
      return res.status(HttpStatus.OK).json(role);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
