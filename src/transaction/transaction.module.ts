import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Liability } from 'src/liability/entities/liability.entity';
import { Asset } from 'src/asset/entities/asset.entity';
import { LiabilityService } from 'src/liability/liability.service';
import { AssetService } from 'src/asset/asset.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Liability, Asset])],
  controllers: [TransactionController],
  providers: [TransactionService, LiabilityService, AssetService],
})
export class TransactionModule {}
