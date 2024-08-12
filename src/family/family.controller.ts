import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Post()
  create(@Req() req) {
    return this.familyService.create(req.user.id);
  }

  @Get()
  findFamilyByToken(@Body() token: string) {
    return this.familyService.findFamilyByToken(token);
  }

  @Post('connect')
  findAll(@Body() token: string,  @Req() req) {
    return this.familyService.connectToFamily( req.user.id, token);
  }

}
