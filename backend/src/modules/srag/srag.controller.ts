import { Controller, Get, Query } from '@nestjs/common';
import { SragService } from './srag.service';
import { GetCasesDto, GetMetricsDto } from './dto/srag.dto';

@Controller('api')
export class SragController {
  constructor(private readonly sragService: SragService) {}

  @Get('metrics')
  async getMetrics(@Query() query: GetMetricsDto) {
    return this.sragService.getMetrics(query);
  }

  @Get('cases')
  async getCases(@Query() query: GetCasesDto) {
    return this.sragService.getCases(query);
  }

  @Get('regions')
  async getRegions() {
    return this.sragService.getRegions();
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
