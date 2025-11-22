import { InputType, Field, Int, Float } from '@nestjs/graphql'
@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  userId!: number
  @Field(() => [String])
  items!: string[]
  @Field(() => Float)
  total!: number
  @Field({ nullable: true })
  status?: string
}