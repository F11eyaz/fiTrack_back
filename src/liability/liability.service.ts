import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLiabilityDto } from './dto/create-liability.dto';
import { UpdateLiabilityDto } from './dto/update-liability.dto';
import { Liability } from './entities/liability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { error } from 'console';
import { parse } from 'path';

@Injectable()
export class LiabilityService {
  constructor(
    @InjectRepository(Liability)
    private readonly liabilityRepository: Repository<Liability>
  ){}


  async create(createLiabilityDto: CreateLiabilityDto, id:number) {
    const newLiability = {
      title: createLiabilityDto.title,
      amount:createLiabilityDto.amount,
      user:{
        id,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return await this.liabilityRepository.save(newLiability)
  }

  async findAll(id:number) {
    return await this.liabilityRepository.find({where:{
      user:{id}
    },
    order:{updatedAt: 'DESC'}
  })
  }

  async findTotalSum(id: number) {
    const totalLiabilities = await this.liabilityRepository
      .createQueryBuilder('liability')
      .select('SUM(liability.amount)', 'sum')
      .where('liability.user.id = :id', { id })
      .getRawOne();
    return totalLiabilities.sum
  }

  async findOne(id: number) {
    const liability = await this.liabilityRepository.findOne({where:{id}})

    if(!liability) {
      throw new NotFoundException("liability not found")
    }

    return liability
  }


  async update(id: number, updateLiabilityDto: UpdateLiabilityDto) {
    const liability = await this.liabilityRepository.findOne({where:{id}})

    if(!liability) {
      throw new NotFoundException("liability not found")
    }
    return await this.liabilityRepository.update(id, updateLiabilityDto)

  }


  async updateBalance(id: number, amount:number) {
    const liability = await this.liabilityRepository.findOne({ where: { id } });

    if (!liability) {
        throw new NotFoundException('liability not found');
    } 
    const updatedBalance: number = liability.amount - amount; 
    return await this.liabilityRepository.update(id, {amount: updatedBalance})
}
  
  async remove(id: number) {
    const liability = await this.liabilityRepository.findOne({where:{id}})

    if(!liability){
      throw new NotFoundException("liability not found")
    }
    return await this.liabilityRepository.delete(id)
  }
}
