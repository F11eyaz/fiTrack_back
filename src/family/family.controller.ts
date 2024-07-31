// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { FamilyService } from './family.service';
// import { CreateFamilyDto } from './dto/create-family.dto';
// import { UpdateFamilyDto } from './dto/update-family.dto';
// import { Req } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
// import { UseGuards } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags("family")
// @Controller('family')
// export class FamilyController {
//   constructor(private readonly familyService: FamilyService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post()
//   create(@Body() createFamilyDto: CreateFamilyDto, @Req() req) {
//     return this.familyService.create(createFamilyDto, req.user.id);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get()
//   findAll(@Req() req) {
//     return this.familyService.findAll(req.user.id);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.familyService.findOne(+id);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateFamilyDto: UpdateFamilyDto) {
//     return this.familyService.update(+id, updateFamilyDto);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.familyService.remove(+id);
//   }
// }
