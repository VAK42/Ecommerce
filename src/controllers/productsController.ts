import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { CreateProductDto } from '../dto/createProduct.dto'
import { productEntity } from '../entities/product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { jwtGuard } from '../guards/jwt.guard'
@Controller('products')
export class productsController {
  constructor(@InjectRepository(productEntity) private readonly repo: Repository<productEntity>) { }
  @Get()
  async list(@Query('q') q?: string, @Query('limit') limit = 12, @Query('offset') offset = 0) {
    const take = Number(limit)
    const skip = Number(offset)
    if (q) {
      const [items, total] = await this.repo.findAndCount({ where: { title: Like(`%${q}%`) }, take, skip })
      return { items, total }
    }
    const [items, total] = await this.repo.findAndCount({ take, skip })
    return { items, total }
  }
  @Get('featured')
  featured() {
    return this.repo.find({ take: 6 })
  }
  @Get('top')
  top() {
    return this.repo.find({ order: { rating: 'DESC' }, take: 10 })
  }
  @Get(':id')
  get(@Param('id') id: number) {
    return this.repo.findOne({ where: { id: Number(id) } })
  }
  @UseGuards(jwtGuard)
  @Post()
  create(@Body() payload: CreateProductDto) {
    const item = this.repo.create(payload)
    return this.repo.save(item)
  }
  @UseGuards(jwtGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() payload) {
    const item = await this.repo.findOne({ where: { id: Number(id) } })
    if (!item) {
      return null
    }
    Object.assign(item, payload)
    return this.repo.save(item)
  }
  @UseGuards(jwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const item = await this.repo.findOne({ where: { id: Number(id) } })
    if (item) {
      await this.repo.remove(item)
      return item
    }
    return { ok: false }
  }
}