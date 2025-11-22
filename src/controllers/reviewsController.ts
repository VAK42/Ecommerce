import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { reviewEntity } from '../entities/review.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
@Controller('reviews')
export class reviewsController {
  constructor(@InjectRepository(reviewEntity) private readonly repo: Repository<reviewEntity>) { }
  @Get()
  list(@Query('productId') productId?: number) {
    if (productId) {
      return this.repo.find({ where: { productId: Number(productId) } })
    }
    return this.repo.find()
  }
  @Get(':id')
  get(@Param('id') id: number) {
    return this.repo.findOne({ where: { id: Number(id) } })
  }
  @UseGuards(jwtGuard)
  @Post()
  async create(@Body() payload) {
    const r = this.repo.create(payload)
    return this.repo.save(r)
  }
  @UseGuards(jwtGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() payload) {
    const r = await this.repo.findOne({ where: { id: Number(id) } })
    if (!r) {
      return null
    }
    Object.assign(r, payload)
    return this.repo.save(r)
  }
  @UseGuards(jwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const r = await this.repo.findOne({ where: { id: Number(id) } })
    if (r) {
      await this.repo.remove(r)
      return r
    }
    return { ok: false }
  }
  @Get('product/:productId/average')
  async average(@Param('productId') productId: number) {
    const items = await this.repo.find({ where: { productId: Number(productId) } })
    if (!items.length) {
      return { average: 0 }
    }
    return { average: items.reduce((s, i) => s + Number(i.rating), 0) / items.length }
  }
}