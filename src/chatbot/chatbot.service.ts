import { Injectable } from '@nestjs/common';
import {  } from 'langchain/chat_models/universal'
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from "@langchain/openai";

import * as dotenv from 'dotenv';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { PromptDto } from './dto/create-chatbot.dto';

@Injectable()
export class ChatbotService {
  private readonly chain: ConversationChain;

  constructor() {
    const chat = new ChatOpenAI({
      temperature: 0.3,
      modelName: 'gpt-4o-mini',
      openAIApiKey: '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'
    });

    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history',
    });

    this.chain = new ConversationChain({
      llm: chat,
      memory,
    });
  }

  async analyzeTransactions(promptDto: PromptDto, transactions?: Transaction[]): Promise<string> {
    let fullPrompt = promptDto.prompt;
  
    if (transactions && transactions.length > 0) {
      const json = JSON.stringify(transactions, null, 2);
      fullPrompt += `\n\nВот транзакции (в формате JSON):\n${json}`;
    }
  
    const result = await this.chain.call({ input: fullPrompt });
    return result.response;
  }
  
}
