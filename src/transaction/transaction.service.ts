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
      family: { id },
    };
  
    return await this.transactionRepository.save(newTransaction);
  }
  

  findAll(id: number) {
    return this.transactionRepository.find({where: 
      {family: {id}},
      order:{createdAt: 'DESC'}
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
  

  async findCash(id: number) {
    const latestTransaction = await this.transactionRepository.findOne({
      order: { id: 'DESC' },
      where: {family:{id}},
    });
    if(latestTransaction){
      return latestTransaction.cashAfter
    }else{
      return 0
    }
  }

  async calculateFinancialStatus(id: number) {
    
    const cash = await this.findCash(id);
  
   
    const totalAssetsSum = await this.assetService.findTotalSum(id)
  
  
    const totalLiabilitiesSum = await this.liabilityService.findTotalSum(id)
  
    
    const financialStatus = cash + (+totalAssetsSum || 0) - (+totalLiabilitiesSum || 0);
  
    return financialStatus;
  }
  
}
