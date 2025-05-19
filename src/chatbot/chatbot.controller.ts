import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UsePipes, UseGuards, ValidationPipe } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { PromptDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles/role.enum';

@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post('analyze')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async analyze(@Req() req, @Body() promptDto: PromptDto) {
    if(promptDto.useTransactions){
      const transactions = await this.transactionService.findAll(req.user.familyId, promptDto.period);
      const result = await this.chatbotService.analyzeTransactions(promptDto, transactions);
      return { result };
    }
    const result = await this.chatbotService.analyzeTransactions(promptDto);
    return { result };
  }
}
