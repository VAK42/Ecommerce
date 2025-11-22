import { productEntity } from '../entities/product.entity'
import { Controller, Get, Query } from '@nestjs/common'
import { orderEntity } from '../entities/order.entity'
import { userEntity } from '../entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
@Controller('analytics')
export class analyticsController {
  constructor(
    @InjectRepository(orderEntity) private readonly orderRepo: Repository<orderEntity>,
    @InjectRepository(productEntity) private readonly productRepo: Repository<productEntity>,
    @InjectRepository(userEntity) private readonly userRepo: Repository<userEntity>,
  ) { }
  @Get('sales')
  async sales(@Query('from') from?: string, @Query('to') to?: string) {
    const orders = await this.orderRepo.find()
    const revenue = orders.reduce((s, o) => s + Number(o.total), 0)
    return { period: [from || 'all', to || 'now'], orders: orders.length, revenue }
  }
  @Get('products')
  async productStats() {
    const products = await this.productRepo.find({ take: 10 })
    return products.map((p) => ({ id: p.id, title: p.title, sold: Math.round(Math.random() * 200) }))
  }
  @Get('users')
  async userStats() {
    const totalUsers = await this.userRepo.count()
    const admins = await this.userRepo.count({ where: { role: 'admin' } })
    return { totalUsers, admins }
  }
}