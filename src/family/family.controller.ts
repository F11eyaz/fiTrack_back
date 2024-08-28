import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { FamilyService } from './family.service';
import { Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('connect')
  connectToFamily(@Body() token: string,  @Req() req) {
    return this.familyService.connectToFamily( req.user.id, token);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('kickUser/:userId')
  async kickUser(
    @Param('userId') userId: number,
    @Req() req
  ) {
    const familyId = req.user.familyId;

    await this.familyService.kickUser(familyId, userId);

  }

}
