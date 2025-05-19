import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Liability } from 'src/liability/entities/liability.entity';
import { Asset } from 'src/asset/entities/asset.entity';
import { LiabilityService } from 'src/liability/liability.service';
import { AssetService } from 'src/asset/asset.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { FamilyService } from 'src/family/family.service';
import { Family } from 'src/family/entities/family.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Liability, Asset, User, Family])],
  controllers: [TransactionController],
  providers: [TransactionService, LiabilityService, AssetService, UserService,  FamilyService ],
  exports: [TransactionService]
})
export class TransactionModule {}
