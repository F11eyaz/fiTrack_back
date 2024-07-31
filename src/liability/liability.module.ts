import { Module } from '@nestjs/common';
import { LiabilityService } from './liability.service';
import { LiabilityController } from './liability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liability } from './entities/liability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Liability])],
  controllers: [LiabilityController],
  providers: [LiabilityService],
})
export class LiabilityModule {}
