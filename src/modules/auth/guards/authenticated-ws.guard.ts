import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { httpErrors } from 'src/shares/exceptions';

@Injectable()
export class AuthenticatedWsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const client = context.switchToWs().getClient();
      return !!client.handshake.auth.id;
    } catch (error) {
      //TODO: handle error
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.BAD_REQUEST);
    }
  }
}
