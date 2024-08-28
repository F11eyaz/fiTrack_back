import { Controller, Get, Post, Body, UsePipes, ValidationPipe, UseGuards, Req, Query, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { CashTransferDto } from './dto/cash-transfer.dto';
import { AdminCashTransferDto } from './dto/admin-cash-transfer.dto';


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
    return this.transactionService.create(createTransactionDto, req.user.familyId, req.user.id);
  }

  @Post('transfer/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  transfer(@Param('id') toId: string, @Body() cashTransferDto: CashTransferDto, @Req() req ) {
    console.log(cashTransferDto.amount)
    return this.transactionService.transfer(cashTransferDto, req.user.id, +toId);
  }

  @Post('adminTransfer')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  adminTransfer(@Body() adminCashTransferDto: AdminCashTransferDto ) {
    return this.transactionService.adminTransfer(adminCashTransferDto);
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
  findTotalCash(@Req() req) {
    return this.transactionService.findTotalCash(+req.user.familyId);
  }

  @Get('userCash')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  findUserCash(@Req() req) {
    return this.transactionService.findUserCash(+req.user.id);
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
