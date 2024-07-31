// import { Injectable } from '@nestjs/common';
// import { CreateFamilyDto } from './dto/create-family.dto';
// import { UpdateFamilyDto } from './dto/update-family.dto';

// import { Family } from './entities/family.entity';
// import {Repository} from 'typeorm'
// import { InjectRepository } from '@nestjs/typeorm';
// import { NotFoundException } from '@nestjs/common';

// @Injectable()
// export class FamilyService {
//   constructor(
//     @InjectRepository(Family)
//     private readonly familyRepository: Repository<Family>,
//   ){}

//   async create(createFamilyDto: CreateFamilyDto, id: number) {   

//     const newFamily = {
//       title: createFamilyDto.title,
//       user: {id,},
//     }
//     return await this.familyRepository.save(newFamily)
//   }

//   async findAll(id: number) {
//     return await this.familyRepository.find({
//       where: {
//         user: {id}
//       },
//     })
//   }

//   async findOne(id: number) {
//     const family = await this.familyRepository.findOne({
//       where:{id},
      
//     })
//     if (!family) throw new NotFoundException("Family not found")
//     return family;
//   }


//   async update(id: number, updateFamilyDto: UpdateFamilyDto) {
//     const family = await this.familyRepository.findOne({
//       where:{id},
//     })

//     if (!family) throw new NotFoundException("Family not found")

//     return await this.familyRepository.update(id, updateFamilyDto);
//   }


//   async remove(id: number) {
//     const category = await this.familyRepository.findOne({
//       where: {id}
//     })

//     if (!category) throw new NotFoundException("Family not found")
      
//     return await this.familyRepository.delete(id)
//   }

// }
