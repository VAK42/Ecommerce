import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common'
import { paymentEntity } from '../entities/payment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
@Controller('payments')
export class paymentsController {
  constructor(@InjectRepository(paymentEntity) private readonly repo: Repository<paymentEntity>) { }
  @UseGuards(jwtGuard)
  @Post('create')
  create(@Body() payload: { providerId: string; amount: number; orderId: number }) {
    const p = this.repo.create({ providerId: payload.providerId || '', amount: payload.amount || 0, status: 'created', orderId: payload.orderId || 0 })
    return this.repo.save(p)
  }
  @Get(':id')
  status(@Param('id') id: string) {
    return this.repo.findOne({ where: { id: Number(id) } })
  }
  @UseGuards(jwtGuard)
  @Post('refund/:id')
  async refund(@Param('id') id: string) {
    const p = await this.repo.findOne({ where: { id: Number(id) } })
    if (p) {
      p.status = 'refunded'
      await this.repo.save(p)
      return { id, refundId: 'ref_' + Math.random().toString(36).slice(2, 8), status: 'refunded' }
    }
    return { ok: false }
  }
}