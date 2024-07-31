import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, UsePipes, Req, Put } from '@nestjs/common';
import { LiabilityService } from './liability.service';
import { CreateLiabilityDto } from './dto/create-liability.dto';
import { UpdateLiabilityDto } from './dto/update-liability.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags("liability")
@Controller('liability')
export class LiabilityController {
  constructor(private readonly liabilityService: LiabilityService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe)
  create(@Body() createLiabilityDto: CreateLiabilityDto, @Req() req) {
    return this.liabilityService.create(createLiabilityDto, req.user.id);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.liabilityService.findAll(req.user.id);
  }

  @Get('totalSum')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findTotalSum(@Req() req) {
    return this.liabilityService.findTotalSum(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.liabilityService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateLiabilityDto: UpdateLiabilityDto) {
    return this.liabilityService.update(+id, updateLiabilityDto);
  }

  @Patch('updateBalance/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateBalance(@Param('id') id: string, @Body() amount: {amount: number} ) {
    
    return this.liabilityService.updateBalance(+id, amount.amount);
}

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.liabilityService.remove(+id);
  }
}
