import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
@Injectable()
export class jwtGuard implements CanActivate {
  constructor(private readonly config: ConfigService) { }
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const auth = req.headers.authorization || req.headers.Authorization
    if (!auth) {
      throw new UnauthorizedException()
    }
    const token = String(auth).startsWith('Bearer') ? String(auth).split(' ')[1] : String(auth)
    try {
      const secret = this.config.get<string>('JWTSECRET') || '5427495e83ae3cc7261132eafb364184507ce1c408702ea36b5e438f8afcf6f792d423615c28897f02a7d132f5fe18ee113b74b72bffbfc5865c88bb966ee47d'
      const payload = jwt.verify(token, secret)
      req.user = payload
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}