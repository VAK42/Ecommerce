import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { UpdateProductInput } from './dto/updateProduct.input'
import { CreateProductInput } from './dto/createProduct.input'
import { Product, mapProductEntity } from './dto/product.type'
import { productEntity } from '../entities/product.entity'
import { adminGuard } from '../guards/admin.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { UseGuards } from '@nestjs/common'
import { Repository } from 'typeorm'
@Resolver(() => Product)
export class productResolver {
  constructor(@InjectRepository(productEntity) private readonly repo: Repository<productEntity>) { }
  @Query(() => [Product], { name: 'products' })
  async products(@Args('limit') limit?: number): Promise<Product[]> {
    const rows = await this.repo.find({ take: limit || 20 })
    return rows.map(mapProductEntity)
  }
  @Query(() => Product, { name: 'product', nullable: true })
  async product(@Args('id') id: number): Promise<Product | null> {
    const r = await this.repo.findOne({ where: { id } })
    if (!r) return null
    return mapProductEntity(r)
  }
  @Mutation(() => Product, { name: 'createProduct' })
  @UseGuards(jwtGuard, adminGuard)
  async createProduct(@Args('input') input: CreateProductInput): Promise<Product> {
    const p = this.repo.create(input)
    const saved = await this.repo.save(p)
    return mapProductEntity(saved)
  }
  @Mutation(() => Product, { name: 'updateProduct' })
  @UseGuards(jwtGuard, adminGuard)
  async updateProduct(@Args('input') input: UpdateProductInput): Promise<Product | null> {
    const existing = await this.repo.findOne({ where: { id: input.id } })
    if (!existing) return null
    Object.assign(existing, input)
    const saved = await this.repo.save(existing)
    return mapProductEntity(saved)
  }
  @Mutation(() => Boolean, { name: 'removeProduct' })
  @UseGuards(jwtGuard, adminGuard)
  async removeProduct(@Args('id') id: number): Promise<boolean> {
    const res = await this.repo.delete(id)
    return res.affected ? res.affected > 0 : false
  }
}