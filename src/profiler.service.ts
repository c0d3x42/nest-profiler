import { Injectable, Logger } from '@nestjs/common';
import * as v8Profiler from 'v8-profiler-next';
import { writeFileSync, statSync } from 'fs';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

@Injectable()
export class ProfilerService {
  private logger = new Logger('profiler');

  static canProfile(): boolean {
    return (
      Boolean(process.env.PROFILE) && Boolean(process.env.PROFILE === 'yes')
    );
  }

  private available(): boolean {
    try {
      const stat = statSync(process.env.PROFILE_DIR);

      const isAvailable: boolean =
        Boolean(process.env.PROFILE_DIR) && stat && stat.isDirectory();

      const t = isAvailable === true ? 'available' : 'unavailable';
      this.logger.debug('Profiling is ' + t);
      return isAvailable;
    } catch (err) {
      this.logger.debug('Profiling is unavailable');
      return false;
    }
  }

  public startCpu(title: string, duration: number) {
    if (!(ProfilerService.canProfile() && this.available())) {
      return;
    }

    this.logger.debug('Starting CPU profiling ' + title);
    v8Profiler.startProfiling(title, true);
    setTimeout(() => {
      this.logger.debug('Stopping CPU profiling ' + title);
      const profiler = v8Profiler.stopProfiling(title);
      profiler.delete();
      this.logger.debug('Stopped CPU profiling ' + title);
      writeFileSync(
        join(process.env.PROFILE_DIR, `cpu-${process.version}.profile`),
        JSON.stringify(profiler),
      );
    }, duration * 1000);
  }

  public startHeap(duration: number) {
    if (!(ProfilerService.canProfile() && this.available())) {
      return;
    }

    this.logger.debug('Starting heap profiling');
    v8Profiler.startSamplingHeapProfiling();
    setTimeout(() => {
      this.logger.debug('Stopping heap profiling');
      const profile = v8Profiler.stopSamplingHeapProfiling();
      this.logger.debug('Stopped heap profiling');
      writeFileSync(
        join(process.env.PROFILE_DIR, `heap-${process.version}.heapprofile`),
        JSON.stringify(profile),
      );
    }, duration * 1000);
  }
}
