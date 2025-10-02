import { Module } from '@nestjs/common';
import { SragController } from './srag.controller';
import { SragService } from './srag.service';

@Module({
  controllers: [SragController],
  providers: [SragService],
})
export class SragModule {}
