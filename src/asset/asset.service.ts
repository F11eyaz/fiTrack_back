import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { error } from 'console';
import { parse } from 'path';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>
  ){}


  async create(createAssetDto: CreateAssetDto, id:number) {
    const newAsset = {
      title: createAssetDto.title,
      amount:createAssetDto.amount,
      family:{
        id,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return await this.assetRepository.save(newAsset)
  }

  async findAll(id:number) {
  
    return await this.assetRepository.find({where:{
      family:{id},
    },
      order:{updatedAt: 'DESC'}
  })
  }

  async findTotalSum(id: number){

    const totalAssets = await this.assetRepository
      .createQueryBuilder('asset')
      .select('SUM(asset.amount)', 'sum')
      .where('asset.family.id = :id', { id })
      .getRawOne();
    return totalAssets.sum;
  }
  
  

  async findOne(id: number) {
    const asset = await this.assetRepository.findOne({where:{id}})

    if(!asset) {
      throw new NotFoundException("Asset not found")
    }

    return asset
  }


  async update(id: number, updateAssetDto: UpdateAssetDto) {
    const asset = await this.assetRepository.findOne({where:{id}})

    if(!asset) {
      throw new NotFoundException("Asset not found")
    }
    return await this.assetRepository.update(id, updateAssetDto)

  }


  async updateBalance(id: number, amount:number) {
    const asset = await this.assetRepository.findOne({ where: { id } });

    if (!asset) {
        throw new NotFoundException('Asset not found');
    }
    
    const updatedBalance: number = asset.amount + amount; // проблема в amount

    return await this.assetRepository.update(id, {amount: updatedBalance})
}
  
  async remove(id: number) {
    const asset = await this.assetRepository.findOne({where:{id}})

    if(!asset){
      throw new NotFoundException("Asset not found")
    }
    return await this.assetRepository.delete(id)
  }
}
