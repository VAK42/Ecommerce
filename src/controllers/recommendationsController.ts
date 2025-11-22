import { Controller, Get, Param, Query } from '@nestjs/common'
import { productEntity } from '../entities/product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
@Controller('recommendations')
export class recommendationsController {
  constructor(@InjectRepository(productEntity) private readonly repo: Repository<productEntity>) { }
  @Get('for-user/:userId')
  forUser(@Param('userId') userId: number) {
    return this.repo.find({ take: 8 })
  }
  @Get('similar/:productId')
  async similar(@Param('productId') productId: number) {
    const items = await this.repo.find({ take: 12 })
    return items.filter((p) => p.id != Number(productId)).slice(0, 6)
  }
  @Get('trending')
  trending() {
    return this.repo.find({ take: 10 })
  }
  @Get('by-category/:cat')
  byCategory(@Param('cat') cat: string) {
    return this.repo.find({ where: { category: cat }, take: 12 })
  }
}