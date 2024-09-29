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
import { ServiceService } from './service.service';
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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ENUMs } from 'lib/enum';

import CreateServiceDto from './dto/create-service.dto';
import UpdateServiceDto from './dto/update-service.dto';
import { Service } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @PartName([ENUMs.SERVICES_PART as string])
  @ApiOperation({ summary: 'Get All Services' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Services not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Service[]>>> {
    try {
      let services: PaginationReturnType<Service[]> =
        await this.serviceService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(services);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @ApiOperation({ summary: 'Get Select Services' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Services not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/select')
  async getSelect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Service[]>> {
    try {
      let services: Service[] = await this.serviceService.getSelect();
      return res.status(HttpStatus.OK).json(services);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SERVICES_PART as string])
  @ApiOperation({ summary: 'Get All Deleted Services' })
  @ApiResponse({
    status: 200,
    description: 'Deleted Services retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Deleted Services not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Service[]>>> {
    try {
      let services: PaginationReturnType<Service[]> =
        await this.serviceService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(services);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SERVICES_PART as string])
  @ApiOperation({ summary: 'Search Services' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Services not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Service[]>> {
    try {
      let services: Service[] = await this.serviceService.search(search);
      return res.status(HttpStatus.OK).json(services);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SERVICES_PART as string])
  @ApiOperation({ summary: 'Search Services' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Services not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Service[]>> {
    try {
      let services: Service[] = await this.serviceService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(services);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SERVICES_PART as string])
  @ApiOperation({ summary: 'Add Service' })
  @ApiResponse({
    status: 200,
    description: 'Service created successfully.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateServiceDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Service>> {
    try {
      const service: Service = await this.serviceService.create(body);
      return res.status(HttpStatus.OK).json(service);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SERVICES_PART as string])
  @ApiOperation({
    summary: 'Resotre Service By Id (deleted flag in database)',
  })
  @ApiParam({ name: 'id', description: 'Service ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  @HttpCode(HttpStatus.OK)
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const service: Id = await this.serviceService.restore(id);
      return res.status(HttpStatus.OK).json(service);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SERVICES_PART as string])
  @ApiOperation({ summary: 'Update Service By Id' })
  @ApiParam({ name: 'id', description: 'Service ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Service Updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateServiceDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Service>> {
    try {
      const service: Service = await this.serviceService.update(id, body);
      return res.status(HttpStatus.OK).json(service);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SERVICES_PART as string])
  @ApiOperation({
    summary: 'Delete Service By Id (restore flag in database)',
  })
  @ApiParam({ name: 'id', description: 'Service ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Service restore successfully.',
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const service: Id = await this.serviceService.delete(id);
      return res.status(HttpStatus.OK).json(service);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}