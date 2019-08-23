import { Module } from '@nestjs/common';
import { ProfilerService } from './profiler.service';
import { ApiController } from './api/api.controller';
import { NestFactory } from '@nestjs/core';
import { MorganModule } from 'nest-morgan';

@Module({
  imports: [MorganModule],
  providers: [ProfilerService],
  exports: [ProfilerService],
  controllers: [ApiController],
})
export class ProfilerModule {}

export async function bootstrap(port: number) {
  if (ProfilerService.canProfile()) {
    const app = await NestFactory.create(ProfilerModule);
    await app.listen(port);
  }
}
