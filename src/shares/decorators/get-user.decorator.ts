import { UsersEntity } from './../../models/entities/users.entity';
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { httpErrors } from '../exceptions';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UsersEntity => {
    const req = ctx.switchToHttp().getRequest();
    try {
      return req.user;
    } catch (error) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.BAD_REQUEST);
    }
  },
);
