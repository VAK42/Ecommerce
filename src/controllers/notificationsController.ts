import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { notificationEntity } from '../entities/notification.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { jwtGuard } from '../guards/jwt.guard'
import { Repository } from 'typeorm'
@Controller('notifications')
export class notificationsController {
  constructor(@InjectRepository(notificationEntity) private readonly repo: Repository<notificationEntity>) { }
  @UseGuards(jwtGuard)
  @Get()
  list() {
    return this.repo.find()
  }
  @UseGuards(jwtGuard)
  @Post('send')
  async send(@Body() payload) {
    const n = this.repo.create(Object.assign({}, payload, { ts: Date.now() }))
    return this.repo.save(n)
  }
  @UseGuards(jwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const n = await this.repo.findOne({ where: { id: Number(id) } })
    if (n) {
      await this.repo.remove(n)
      return n
    }
    return { ok: false }
  }
}