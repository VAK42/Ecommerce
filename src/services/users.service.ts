import { InjectRepository } from '@nestjs/typeorm'
import { userEntity } from '../entities/user.entity'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
@Injectable()
export class usersService {
  constructor(@InjectRepository(userEntity) private readonly repo: Repository<userEntity>) { }
  create(payload: Partial<userEntity>) {
    const u = this.repo.create(payload)
    return this.repo.save(u)
  }
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } })
  }
  findById(id: number) {
    return this.repo.findOne({ where: { id } })
  }
  list() {
    return this.repo.find()
  }
}