import { PartialType } from '@nestjs/swagger';
import { PromptDto } from './create-chatbot.dto';

export class UpdateChatbotDto extends PartialType(PromptDto) {}
