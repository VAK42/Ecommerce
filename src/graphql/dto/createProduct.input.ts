import { InputType, Field, Int, Float } from '@nestjs/graphql'
@InputType()
export class CreateProductInput {
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
}