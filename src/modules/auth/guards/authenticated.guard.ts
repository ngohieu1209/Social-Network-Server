import { httpErrors } from './../../../shares/exceptions/index';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    try {
      // console.log('authenticated can active');
      const request = context.switchToHttp().getRequest();
      return request.isAuthenticated();
    } catch (error) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.BAD_REQUEST);
    }
  }
}
