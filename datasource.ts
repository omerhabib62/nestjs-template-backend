import { DataSource } from 'typeorm';
import { configuration } from './config';

export const AppDataSource = new DataSource({
  type: configuration.DB_TYPE as
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mariadb'
    | 'mongodb',
  host: configuration.DB_HOST,
  port: configuration.DB_PORT,
  username: configuration.DB_USER,
  password: configuration.DB_PASSWORD,
  database: configuration.DB_NAME,
  synchronize: false, // Set to false for production and use migrations
  logging: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  subscribers: [], // Optional: add if you are using subscribers,
  migrationsTableName: '_migrations',
  migrationsRun: false,
});
