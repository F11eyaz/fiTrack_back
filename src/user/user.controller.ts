import { Controller,Post, Get, Body,ValidationPipe, Put, Req, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';


@ApiTags("user")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('currentUser')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  findCurrentUser(@Req() req) {
    return this.userService.findOneById(req.user.id);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll() {
    return this.userService.findAll();
  }
  

  @Get('familyUsers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  findFamilyUsers(@Req() req) {
    return this.userService.findFamilyUsers(req.user.familyId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch("updatePersonalData")
  async updatePersonalData(@Body() updatePersonalDataDto: UpdatePersonalDataDto, @Req() req){
    return this.userService.updatePersonalData(updatePersonalDataDto, req.user.id)
  } 

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put("change-password")
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req){
    return this.userService.changePassword(changePasswordDto.oldPassword, changePasswordDto.newPassword, req.user.id)
  } 

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Delete("deleteAccount")
  // async deleteAccount(@Req() req){
  //   return this.userService.deleteAccount(req.user.id)
  // } 
}
