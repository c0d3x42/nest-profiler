import { Test, TestingModule } from '@nestjs/testing';
import { ProfilerService } from './profiler.service';

describe('ProfilerService', () => {
  let service: ProfilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilerService],
    }).compile();

    service = module.get<ProfilerService>(ProfilerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
