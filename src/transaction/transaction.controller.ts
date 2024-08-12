import { Controller, Get, Post, Body, UsePipes, ValidationPipe, UseGuards, Req, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';


@ApiTags("transaction")
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    return this.transactionService.create(createTransactionDto, req.user.familyId);
  }

  @Get()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  findAll(@Req() req) {
    return this.transactionService.findAll(req.user.familyId);
  }

  @Get('forDate')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  findForDate(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,

  ) {
    return this.transactionService.findForDate(startDate, endDate, req.user.familyId);
  }

  @Get("expenses")
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  findAllExpenses(@Req() req) {
    return this.transactionService.findExpensesStats(req.user.familyId);
  }

  @Get('latestCash')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  findCash(@Req() req) {
    return this.transactionService.findCash(+req.user.familyId);
  }

  @Get('financialStatus')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  findFinancialStatus(@Req() req) {
    return this.transactionService.calculateFinancialStatus(+req.user.familyId);
  }
}
