import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { AssetService } from 'src/asset/asset.service';
import { LiabilityService } from 'src/liability/liability.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { CashTransferDto } from './dto/cash-transfer.dto';
import { AdminCashTransferDto } from './dto/admin-cash-transfer.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly assetService: AssetService,
    private readonly liabilityService: LiabilityService,
    private readonly userService: UserService,
  ){}

  async create(createTransactionDto: CreateTransactionDto, familyId: number, userId: number) {
    const user = await this.userService.findOneById(userId)

    const adjustedAmount = createTransactionDto.action === '-' ? -createTransactionDto.amount : createTransactionDto.amount;
    
    let newCashAfter: number;
  
      if (user.cash + adjustedAmount >= 0) {
        newCashAfter = user.cash + adjustedAmount;
        user.cash += adjustedAmount
      } else {
        throw new BadRequestException("Недостаточно средств");
      }
    
    const newTransaction = {
      amount: adjustedAmount,
      action: createTransactionDto.action,
      cashAfter: newCashAfter,
      category: createTransactionDto.category,
      family: { id: familyId },
      user: {id: userId},
    };

    
    await this.userRepository.save(user)
    return await this.transactionRepository.save(newTransaction);

  }

  async transfer(cashTransferDto: CashTransferDto, fromId: number, toId: number) {
    const fromUser = await this.userService.findOneById(fromId)
    const toUser = await this.userService.findOneById(toId)

    if (fromUser.cash < cashTransferDto.amount) {
      throw new BadRequestException("Недостаточно средств для перевода");
    }
    fromUser.cash -= cashTransferDto.amount
    toUser.cash += cashTransferDto.amount

    await this.userRepository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(fromUser);
      await transactionalEntityManager.save(toUser);
  });
  }

  async adminTransfer(adminCashTransferDto: AdminCashTransferDto) {
    const fromUser = await this.userService.findOne(adminCashTransferDto.from)
    const toUser = await this.userService.findOne(adminCashTransferDto.to)

    if (fromUser.cash < adminCashTransferDto.amount) {
      throw new BadRequestException("Недостаточно средств для перевода");
    }
    fromUser.cash -= adminCashTransferDto.amount
    toUser.cash += adminCashTransferDto.amount

    await this.userRepository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(fromUser);
      await transactionalEntityManager.save(toUser);
  });
  }


  findAll(familyId: number) {
    return this.transactionRepository.find({where: 
      {family: {id: familyId}},
      order:{createdAt: 'DESC'},
      relations:['user'],
      select: {
        id: true, 
        amount: true, 
        category: true,
        createdAt: true, 
        user: {
          email: true, 
        },
      },
    },
  );
  }

  async findExpensesStats(id: number) {
  
    const totalExpenses = await this.transactionRepository
    .createQueryBuilder('transaction')
    .select('SUM(-transaction.amount)', 'sum') // -transaction.amount чтобы перевести их в положительное число
    .where("transaction.action = '-' AND transaction.family.id = :id", {id})
    .getRawOne()

    const totalExpensesForCategory = await this.transactionRepository
    .createQueryBuilder('transaction')
    .select('transaction.category', 'category' )
    .addSelect("SUM(-transaction.amount)", "sum")
    .addSelect("ROUND(SUM(-transaction.amount) * 100.0 / :totalExpenses)", "percentage")
    .groupBy('transaction.category')
    .orderBy('sum', 'DESC')
    .where("transaction.family.id = :id AND transaction.action = '-' ", {id, totalExpenses: totalExpenses.sum})
    .take(5)
    .getRawMany()

    return totalExpensesForCategory|| 'No expenses for the category yet'
    // здесь problema ERROR ExceptionsHandler функция round(double precision, integer) не существует - решить 
  }
  
  findForDate(
    startDate: string, 
    endDate: string, 
    id: number
  ) {
    const query = this.transactionRepository.createQueryBuilder('transaction');
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
  
    query
      .where('transaction.createdAt >= :start AND transaction.createdAt < :end')
      .andWhere('transaction.family.id = :id')
      .setParameters({ start, end, id });
  
    return query.getMany();
  }

  async findUserCash(userId: number) {
    const user = await this.userService.findOneById(userId)
    return user.cash;
  }

  async findTotalCash(familyId: number) {
    const allUsers = await this.userRepository.find({where: {family: {id: familyId}}})
    const totalCash = allUsers.reduce((total, user) => total + user.cash, 0 )
    return totalCash;
  }

  async calculateFinancialStatus(familyId: number) {
    
    const cash = await this.findTotalCash(familyId);
  
   
    const totalAssetsSum = await this.assetService.findTotalSum(familyId)
  
  
    const totalLiabilitiesSum = await this.liabilityService.findTotalSum(familyId)
  
    
    const financialStatus = cash + (+totalAssetsSum || 0) - (+totalLiabilitiesSum || 0);
  
    return financialStatus;
  }
  
}
