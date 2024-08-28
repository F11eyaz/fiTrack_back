import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLiabilityDto } from './dto/create-liability.dto';
import { UpdateLiabilityDto } from './dto/update-liability.dto';
import { Liability } from './entities/liability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'

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
      family:{
        id,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return await this.liabilityRepository.save(newLiability)
  }

  async findAll(id:number) {
    return await this.liabilityRepository.find({where:{
      family:{id}
    },
    order:{updatedAt: 'DESC'}
  })
  }

  async findTotalSum(id: number) {
    const totalLiabilities = await this.liabilityRepository
      .createQueryBuilder('liability')
      .select('SUM(liability.amount)', 'sum')
      .where('liability.family.id = :id', { id })
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
    if(amount){
      const updatedBalance: number = liability.amount - amount; 
      return await this.liabilityRepository.update(id, {amount: updatedBalance})
    }else{
      throw new BadRequestException("Сумма не должна быть пустой")
    }
}
  
  async remove(id: number) {
    const liability = await this.liabilityRepository.findOne({where:{id}})

    if(!liability){
      throw new NotFoundException("liability not found")
    }
    return await this.liabilityRepository.delete(id)
  }
}
