import { Controller, Post, Body } from '@nestjs/common'
import { authService } from '../services/auth.service'
@Controller('auth')
export class authController {
  constructor(private readonly auth: authService) { }
  @Post('login')
  async login(@Body() payload) {
    const user = await this.auth.validateUser(payload.email, payload.password)
    if (!user) {
      return { ok: false, message: 'Invalid' }
    }
    return Object.assign({ ok: true }, await this.auth.login(user))
  }
}