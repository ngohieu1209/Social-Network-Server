import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as config from './ormconfig';
import { DatabaseCommonModule } from './models/database-common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      ...config,
      entities: [__dirname + '/../models/entities/**/*{.ts, .js}'],
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    DatabaseCommonModule,
  ],
})
export class AppModule {}
