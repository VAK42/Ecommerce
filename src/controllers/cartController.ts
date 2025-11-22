import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common'
import { orderEntity } from '../entities/order.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
@Controller('cart')
export class cartController {
  constructor(@InjectRepository(orderEntity) private readonly orderRepo: Repository<orderEntity>) { }
  @Get(':userId')
  get(@Param('userId') userId: number) {
    return { userId: Number(userId), items: [] }
  }
  @Post(':userId/add')
  add(@Param('userId') userId: number, @Body() payload) {
    return { ok: true, userId: Number(userId), item: payload }
  }
  @Post(':userId/remove')
  remove(@Param('userId') userId: number, @Body() payload) {
    return { ok: true, userId: Number(userId), removed: payload }
  }
  @UseGuards(jwtGuard)
  @Post(':userId/checkout')
  async checkout(@Req() req, @Param('userId') userId: number, @Body() payload) {
    const order = this.orderRepo.create({ userId: Number(userId) || req.user.sub, items: payload.items, total: payload.total, status: 'pending' })
    return this.orderRepo.save(order)
  }
}