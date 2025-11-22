import { Injectable } from '@nestjs/common'
import { usersService } from './users.service'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
@Injectable()
export class authService {
  constructor(private readonly users: usersService, private readonly config: ConfigService) { }
  async validateUser(email: string, password: string): Promise<any> {
    const u = await this.users.findByEmail(email)
    if (!u) {
      return null
    }
    const ok = await bcrypt.compare(String(password), String(u.password))
    if (!ok) {
      return null
    }
    const { password: _, ...rest } = u
    return rest
  }
  async login(user: any) {
    const secret = this.config.get<string>('JWTSECRET') || '5427495e83ae3cc7261132eafb364184507ce1c408702ea36b5e438f8afcf6f792d423615c28897f02a7d132f5fe18ee113b74b72bffbfc5865c88bb966ee47d'
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret, { expiresIn: '7d' })
    return { accessToken: token }
  }
}