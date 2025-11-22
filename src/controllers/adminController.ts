import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { productEntity } from '../entities/product.entity'
import { orderEntity } from '../entities/order.entity'
import { userEntity } from '../entities/user.entity'
import { adminGuard } from '../guards/admin.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
@Controller('admin')
export class adminController {
  constructor(
    @InjectRepository(userEntity) private readonly userRepo: Repository<userEntity>,
    @InjectRepository(productEntity) private readonly productRepo: Repository<productEntity>,
    @InjectRepository(orderEntity) private readonly orderRepo: Repository<orderEntity>,
  ) { }
  @UseGuards(jwtGuard, adminGuard)
  @Get('users')
  listUsers() {
    return this.userRepo.find()
  }
  @UseGuards(jwtGuard, adminGuard)
  @Get('orders')
  listOrders() {
    return this.orderRepo.find()
  }
  @UseGuards(jwtGuard, adminGuard)
  @Get('products')
  listProducts() {
    return this.productRepo.find()
  }
  @UseGuards(jwtGuard, adminGuard)
  @Post('product/:id/stock')
  async updateStock(@Param('id') id: number, @Body() payload) {
    const p = await this.productRepo.findOne({ where: { id: Number(id) } })
    if (p) {
      p.stock = payload.stock
      return this.productRepo.save(p)
    }
    return null
  }
  @UseGuards(jwtGuard, adminGuard)
  @Get('reports/sales')
  async salesReport() {
    const orders = await this.orderRepo.find()
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0)
    return { totalOrders, totalRevenue }
  }
}