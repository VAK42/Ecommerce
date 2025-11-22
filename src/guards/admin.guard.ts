import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
@Injectable()
export class adminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const user = req.user
    if (!user) {
      throw new ForbiddenException()
    }
    return user.role === 'admin'
  }
}