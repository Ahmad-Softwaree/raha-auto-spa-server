import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PartGuard } from 'src/auth/part.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { ENUMs } from 'lib/enum';
import { PartName } from 'src/auth/part.decorator';
import { Request, Response } from 'express';
import { Dashboard } from 'src/types/dashboard';

@UseGuards(AuthGuard, PartGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @PartName([ENUMs.DASHBOARD_PART as string])
  @Get('')
  async get(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Dashboard>> {
    try {
      let dashboards: Dashboard = await this.dashboardService.get();
      return res.status(HttpStatus.OK).json(dashboards);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
