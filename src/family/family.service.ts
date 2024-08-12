import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { User } from 'src/user/entities/user.entity';
import {Repository} from 'typeorm'
import { error } from 'console';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}
  
  async create(id: number) {
  
    const user = await this.userRepository.findOne({where:{id}});

    const family = this.familyRepository.create({
      users: []
    });

    family.users.push(user)

    await this.familyRepository.save(family);

    return family
  }

  async findFamilyByToken(token: string) {
    const family = await this.familyRepository.findOne({where:{token}})
    return family
  }

  async connectToFamily(id: number, token: string){
    const family = await this.familyRepository.findOne({
      where: { token },
      relations: ['users'], // Загружаем связанных пользователей
    });

    
    if(!family){
      throw new BadRequestException ('Такой семьи не существует')
    }
    const user = await this.userRepository.findOne({where:{id}});
    family.users.push(user)
    await this.familyRepository.save(family);
    return family
    
  }
}

  