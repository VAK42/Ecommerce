import { productEntity } from '../entities/product.entity'
import { Controller, Get, Query } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
@Controller('search')
export class searchController {
  constructor(@InjectRepository(productEntity) private readonly repo: Repository<productEntity>) { }
  @Get()
  async search(@Query('q') q: string, @Query('limit') limit = 20, @Query('offset') offset = 0) {
    if (!q) return { items: [], total: 0 }
    const take = Number(limit)
    const skip = Number(offset)
    const [items, total] = await this.repo.findAndCount({ where: { title: Like(`%${q}%`) }, take, skip })
    return { items, total }
  }
  @Get('suggest')
  async suggest(@Query('q') q: string) {
    if (!q) {
      return []
    }
    const items = await this.repo.find({ where: { title: Like(`%${q}%`) }, take: 10 })
    return Array.from(new Set(items.map((i) => i.title))).slice(0, 10)
  }
}