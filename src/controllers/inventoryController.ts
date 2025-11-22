import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { productEntity } from '../entities/product.entity'
import { adminGuard } from '../guards/admin.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository, LessThan } from 'typeorm'
@Controller('inventory')
export class inventoryController {
  constructor(@InjectRepository(productEntity) private readonly repo: Repository<productEntity>) { }
  @Get('levels')
  levels() {
    return this.repo.find({ select: ['id', 'stock'] })
  }
  @UseGuards(jwtGuard, adminGuard)
  @Post('adjust/:id')
  async adjust(@Param('id') id: number, @Body() payload) {
    const p = await this.repo.findOne({ where: { id: Number(id) } })
    if (p) {
      p.stock = payload.stock
      return this.repo.save(p)
    }
    return null
  }
  @Get('low')
  low() {
    return this.repo.find({ where: { stock: LessThan(10) } })
  }
  @Get('summary')
  async summary() {
    const totalProducts = await this.repo.count()
    const { totalStock } = await this.repo
      .createQueryBuilder('p')
      .select('SUM(p.stock)', 'totalStock')
      .getRawOne()
    return { totalProducts, totalStock: Number(totalStock) || 0 }
  }
}