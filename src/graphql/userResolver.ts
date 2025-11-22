import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { User, mapUserEntity } from './dto/user.type'
import { RegisterInput } from './dto/register.input'
import { userEntity } from '../entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
@Resolver(() => User)
export class userResolver {
  constructor(@InjectRepository(userEntity) private readonly repo: Repository<userEntity>) { }
  @Query(() => [User], { name: 'users' })
  async users(): Promise<User[]> {
    const rows = await this.repo.find()
    return rows.map(mapUserEntity)
  }
  @Query(() => User, { name: 'user', nullable: true })
  async user(@Args('id') id: number): Promise<User | null> {
    const r = await this.repo.findOne({ where: { id } })
    if (!r) return null
    return mapUserEntity(r)
  }
  @Mutation(() => User, { name: 'register' })
  async register(@Args('input') input: RegisterInput): Promise<User> {
    const hash = await bcrypt.hash(String(input.password || 'password'), 10)
    const u = this.repo.create(Object.assign({}, input, { password: hash }))
    const saved = await this.repo.save(u)
    return mapUserEntity(saved)
  }
}