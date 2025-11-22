import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { CreateOrderInput } from './dto/createOrder.input'
import { Order, mapOrderEntity } from './dto/order.type'
import { InjectRepository } from '@nestjs/typeorm'
import { orderEntity } from '../entities/order.entity'
import { jwtGuard } from '../guards/jwt.guard'
import { UseGuards } from '@nestjs/common'
import { Repository } from 'typeorm'
@Resolver(() => Order)
export class orderResolver {
  constructor(@InjectRepository(orderEntity) private readonly repo: Repository<orderEntity>) { }
  @Query(() => [Order], { name: 'orders' })
  async orders(): Promise<Order[]> {
    const rows = await this.repo.find()
    return rows.map(mapOrderEntity)
  }
  @Query(() => Order, { name: 'order', nullable: true })
  async order(@Args('id') id: number): Promise<Order | null> {
    const r = await this.repo.findOne({ where: { id } })
    if (!r) return null
    return mapOrderEntity(r)
  }
  @Mutation(() => Order, { name: 'createOrder' })
  @UseGuards(jwtGuard)
  async createOrder(@Args('input') input: CreateOrderInput): Promise<Order> {
    const o = this.repo.create(Object.assign({ status: 'pending' }, input))
    const saved = await this.repo.save(o)
    return mapOrderEntity(saved)
  }
}