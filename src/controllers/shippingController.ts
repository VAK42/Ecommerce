import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { shippingEntity } from '../entities/shipping.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
@Controller('shipping')
export class shippingController {
  constructor(@InjectRepository(shippingEntity) private readonly repo: Repository<shippingEntity>) { }
  @Get('rates')
  list() {
    return [{ service: 'standard', days: 5, price: 5 }, { service: 'express', days: 2, price: 15 }]
  }
  @UseGuards(jwtGuard)
  @Post('estimate')
  estimate(@Body() payload) {
    const s = this.repo.create({ orderId: payload.orderId || 0, service: 'standard', days: 3, price: Math.round(Math.random() * 20) + 5, status: 'created' })
    return this.repo.save(s)
  }
  @Get('track/:id')
  track(@Param('id') id: string) {
    return this.repo.findOne({ where: { id: Number(id) } })
  }
}