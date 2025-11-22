import { userEntity } from '../../entities/user.entity'
import { ObjectType, Field, Int } from '@nestjs/graphql'
@ObjectType()
export class User {
  @Field(() => Int)
  id!: number
  @Field()
  email!: string
  @Field()
  name!: string
  @Field()
  role!: string
}
export function mapUserEntity(e: userEntity): User {
  const u = new User()
  u.id = e.id
  u.email = e.email
  u.name = e.name
  u.role = e.role
  return u
}