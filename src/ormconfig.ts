import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  name: 'default',
  type: 'mysql',
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/models/entities/**/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts, .js}'],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
};

module.exports = config;
