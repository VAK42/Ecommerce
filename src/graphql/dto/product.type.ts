import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { productEntity } from '../../entities/product.entity'
@ObjectType()
export class Product {
  @Field(() => Int)
  id!: number
  @Field()
  title!: string
  @Field(() => Float)
  price!: number
  @Field(() => Int)
  stock!: number
  @Field()
  category!: string
  @Field(() => Float)
  rating!: number
  @Field({ nullable: true })
  description?: string
  @Field({ nullable: true })
  sku?: string
  @Field({ nullable: true })
  imageUrl?: string
  @Field()
  createdAt!: Date
  @Field()
  updatedAt!: Date
}
export function mapProductEntity(e: productEntity): Product {
  const p = new Product()
  p.id = e.id
  p.title = e.title
  p.price = Number(e.price)
  p.stock = Number(e.stock)
  p.category = e.category
  p.rating = Number(e.rating)
  p.description = e.description
  p.sku = e.sku
  p.imageUrl = e.imageUrl
  p.createdAt = e.createdAt ? new Date(e.createdAt) : new Date()
  p.updatedAt = e.updatedAt ? new Date(e.updatedAt) : new Date()
  return p
}