import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { AssetService } from 'src/asset/asset.service';
import { LiabilityService } from 'src/liability/liability.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    
    private readonly assetService: AssetService,

    private readonly liabilityService: LiabilityService,
  ){}

  async create(createTransactionDto: CreateTransactionDto, id: number) {
    const latestCash = await this.findCash(+id)

    const adjustedAmount = createTransactionDto.action === '-' ? -createTransactionDto.amount : createTransactionDto.amount;
    
  
    // Calculate the new cashAfter
    let newCashAfter: number;
  
      if (latestCash + adjustedAmount >= 0) {
        newCashAfter = latestCash + adjustedAmount;
      } else {
        throw new BadRequestException("Недостаточно средств");
      }
    
  
    const newTransaction = {
      amount: adjustedAmount,
      action: createTransactionDto.action,
      cashAfter: newCashAfter,
      category: createTransactionDto.category,
      user: { id },
    };
  
    return await this.transactionRepository.save(newTransaction);
  }
  

  findAll(id: number) {
    return this.transactionRepository.find({where: 
      {user: {id}},
      order:{createdAt: 'DESC'}
    },
  );
  }

  async findExpensesStats(id: number) {
  
    const totalExpenses = await this.transactionRepository
    .createQueryBuilder('transaction')
    .select('SUM(-transaction.amount)', 'sum') // -transaction.amount чтобы перевести их в положительное число
    .where("transaction.action = '-' AND transaction.user.id = :id", {id})
    .getRawOne()

    const totalExpensesForCategory = await this.transactionRepository
    .createQueryBuilder('transaction')
    .select('transaction.category', 'category' )
    .addSelect("SUM(-transaction.amount)", "sum")
    .addSelect("ROUND((SUM(-transaction.amount) * 100.0 / :totalExpenses), 2)", "percentage")
    .groupBy('transaction.category')
    .orderBy('sum', 'DESC')
    .where("transaction.user.id = :id AND transaction.action = '-' ", {id, totalExpenses: totalExpenses.sum})
    .take(5)
    .getRawMany()

    return totalExpensesForCategory|| 'No expenses for the category yet'
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
      .andWhere('transaction.user.id = :id')
      .setParameters({ start, end, id });
  
    return query.getMany();
  }
  

  async findCash(id: number) {
    const latestTransaction = await this.transactionRepository.findOne({
      order: { id: 'DESC' },
      where: {user:{id}},
    });
    if(latestTransaction){
      return latestTransaction.cashAfter
    }else{
      return 0
    }
  }

  async calculateFinancialStatus(id: number) {
    // Fetch user's cash
    const cash = await this.findCash(id);
  
    // Calculate total assets for the user
    const totalAssetsSum = await this.assetService.findTotalSum(id)
  
    // Calculate total liabilities for the user
    const totalLiabilitiesSum = await this.liabilityService.findTotalSum(id)
  
    // Calculate financial status
    const financialStatus = cash + (+totalAssetsSum || 0) - (+totalLiabilitiesSum || 0);
  
    return financialStatus;
  }
  
}
