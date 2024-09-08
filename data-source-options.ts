import { ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";

export const createDataSourceOptions = (configService: ConfigService): DataSourceOptions => ({
    type: configService.get<'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mongodb'>('DB_TYPE'),
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: false, 
    logging: false,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    subscribers: [],
    migrationsTableName: '_migrations',
    migrationsRun: false,
  });
  