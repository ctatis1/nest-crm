import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  // TypeORM (SQL) config
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'nestcrm',
  schema: process.env.DB_SCHEMA || 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  charset: 'utf8',
  // MongoDB config
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/nestcrm',
})); 