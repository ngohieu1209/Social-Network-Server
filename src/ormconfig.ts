import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  name: 'default',
  type: 'mysql',
  port: 13306,
  username: 'root',
  password: '12092000',
  database: 'winter_social_network',
  entities: [__dirname + '/models/entities/**/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts, .js}'],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
};

module.exports = config;
