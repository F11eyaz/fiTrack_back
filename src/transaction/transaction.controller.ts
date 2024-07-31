import { Controller, Get, Post, Body, UsePipes, ValidationPipe, UseGuards, Req, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiTags("transaction")
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    return this.transactionService.create(createTransactionDto, req.user.id);
  }

  @Get()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.transactionService.findAll(req.user.id);
  }

  @Get('forDate')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findForDate(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,

  ) {
    return this.transactionService.findForDate(startDate, endDate, req.user.id);
  }

  @Get("expenses")
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findAllExpenses(@Req() req) {
    return this.transactionService.findExpensesStats(req.user.id);
  }

  @Get('latestCash')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findCash(@Req() req) {
    return this.transactionService.findCash(+req.user.id);
  }

  @Get('financialStatus')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findFinancialStatus(@Req() req) {
    return this.transactionService.calculateFinancialStatus(+req.user.id);
  }
}
