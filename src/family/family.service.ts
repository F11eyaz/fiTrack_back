import { BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { User } from 'src/user/entities/user.entity';
import {Repository} from 'typeorm'

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

  async kickUser(familyId: number, userId: number): Promise<void> {
    const family = await this.familyRepository.findOne({
      where: { id: familyId },
      relations: ['users'],
    });

    if (!family) {
      throw new BadRequestException('Такой семьи не существует');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Такого пользователя не существует');
    }
    if (!family.users.some(user => user.id == userId)) {
      throw new BadRequestException('Пользователь не является членом этой семьи');
    }

    family.users = family.users.filter(user => user.id != userId);

    await this.familyRepository.save(family);

    // Тут крч user.id и userId - разные типы поэтому == а не ===
  }

  async remove(familyId: number){
    await this.familyRepository.delete(familyId)
  }
}

  