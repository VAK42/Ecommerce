import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { orderEntity } from '../../entities/order.entity'
@ObjectType()
export class Order {
  @Field(() => Int)
  id!: number
  @Field(() => Int)
  userId!: number
  @Field(() => [String])
  items!: string[]
  @Field(() => Float)
  total!: number
  @Field()
  status!: string
  @Field()
  createdAt!: Date
}
export function mapOrderEntity(e: orderEntity): Order {
  const o = new Order()
  o.id = e.id
  o.userId = e.userId
  if (typeof e.items === 'string') {
    try {
      o.items = JSON.parse(e.items)
    } catch {
      o.items = []
    }
  } else {
    o.items = e.items || []
  }
  o.total = Number(e.total)
  o.status = e.status
  o.createdAt = e.createdAt ? new Date(e.createdAt) : new Date()
  return o
}