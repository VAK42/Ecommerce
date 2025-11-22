import { InputType, Field, Int, Float } from '@nestjs/graphql'
@InputType()
export class UpdateProductInput {
  @Field(() => Int)
  id!: number
  @Field({ nullable: true })
  title?: string
  @Field(() => Float, { nullable: true })
  price?: number
  @Field(() => Int, { nullable: true })
  stock?: number
  @Field({ nullable: true })
  category?: string
  @Field(() => Float, { nullable: true })
  rating?: number
  @Field({ nullable: true })
  description?: string
  @Field({ nullable: true })
  sku?: string
  @Field({ nullable: true })
  imageUrl?: string
}