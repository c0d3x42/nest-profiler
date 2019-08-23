import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ProfilerService } from '../profiler.service';
import { MorganInterceptor } from 'nest-morgan';

@Controller('api/profile')
export class ApiController {
  private profilerService: ProfilerService;

  public constructor() {
    this.profilerService = new ProfilerService();
  }

  @UseInterceptors(MorganInterceptor('combined'))
  @Get('cpu/:title/:duration')
  public startCpu(@Param() params) {
    this.profilerService.startCpu(params.title, params.duration);
    return {};
  }

  @UseInterceptors(MorganInterceptor('combined'))
  @Get('heap/:duration')
  public startHeap(@Param() params) {
    this.profilerService.startHeap(params.duration);
    return {};
  }
}
