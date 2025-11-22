import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common'
import { orderEntity } from '../entities/order.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
@Controller('orders')
export class ordersController {
  constructor(@InjectRepository(orderEntity) private readonly repo: Repository<orderEntity>) { }
  @Get()
  list(@Query('userId') userId?: number, @Query('status') status?: string) {
    const where: Partial<orderEntity> = {}
    if (userId) {
      where.userId = Number(userId)
    }
    if (status) {
      where.status = status
    }
    return this.repo.find({ where })
  }
  @Get(':id')
  get(@Param('id') id: number) {
    return this.repo.findOne({ where: { id: Number(id) } })
  }
  @UseGuards(jwtGuard)
  @Post()
  create(@Req() req, @Body() payload) {
    const o = this.repo.create(Object.assign({ userId: payload.userId || req.user.sub, status: 'pending' }, payload))
    return this.repo.save(o)
  }
  @UseGuards(jwtGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() payload) {
    const o = await this.repo.findOne({ where: { id: Number(id) } })
    if (!o) {
      return null
    }
    Object.assign(o, payload)
    return this.repo.save(o)
  }
  @UseGuards(jwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const o = await this.repo.findOne({ where: { id: Number(id) } })
    if (o) {
      await this.repo.remove(o)
      return o
    }
    return { ok: false }
  }
}