import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { couponEntity } from '../entities/coupon.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { adminGuard } from '../guards/admin.guard'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
@Controller('coupons')
export class couponsController {
  constructor(@InjectRepository(couponEntity) private readonly repo: Repository<couponEntity>) { }
  @Get()
  list() {
    return this.repo.find()
  }
  @Get(':code')
  get(@Param('code') code: string) {
    return this.repo.findOne({ where: { code } })
  }
  @UseGuards(jwtGuard, adminGuard)
  @Post()
  create(@Body() payload) {
    const c = this.repo.create(payload)
    return this.repo.save(c)
  }
  @UseGuards(jwtGuard, adminGuard)
  @Delete(':code')
  async remove(@Param('code') code: string) {
    const c = await this.repo.findOne({ where: { code } })
    if (c) {
      await this.repo.remove(c)
      return c
    }
    return { ok: false }
  }
}