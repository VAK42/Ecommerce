import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req, ConflictException } from '@nestjs/common'
import { userEntity } from '../entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
@Controller('users')
export class usersController {
  constructor(@InjectRepository(userEntity) private readonly repo: Repository<userEntity>) { }
  @Post('register')
  async register(@Body() payload) {
    try {
      const hash = await bcrypt.hash(String(payload.password || 'password'), 10)
      const u = this.repo.create(Object.assign({}, payload, { password: hash }))
      return await this.repo.save(u)
    } catch (e: any) {
      if (e.code === 'SQLITE_CONSTRAINT' || e.message.includes('UNIQUE')) {
        throw new ConflictException('Email already in use')
      }
      throw e
    }
  }
  @UseGuards(jwtGuard)
  @Get('me')
  me(@Req() req) {
    return this.repo.findOne({ where: { id: req.user.sub } })
  }
  @Get()
  list(@Query('role') role?: string) {
    if (role) {
      return this.repo.find({ where: { role } })
    }
    return this.repo.find()
  }
  @Get(':id')
  get(@Param('id') id: number) {
    return this.repo.findOne({ where: { id: Number(id) } })
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() payload) {
    const u = await this.repo.findOne({ where: { id: Number(id) } })
    if (!u) {
      return null
    }
    Object.assign(u, payload)
    return this.repo.save(u)
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const u = await this.repo.findOne({ where: { id: Number(id) } })
    if (u) {
      await this.repo.remove(u)
      return u
    }
    return { ok: false }
  }
}