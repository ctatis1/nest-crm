import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { CiudadesModule } from './ciudades/ciudades.module';
import { CompaniasModule } from './companias/companias.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { EventsModule } from './events/events.module';
import { ScriptsModule } from './scripts/scripts.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters/http-exception.filter';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('database.type') as any,
        host: configService.get('database.host') as any,
        port: configService.get('database.port') as any,
        username: configService.get('database.username') as any,
        password: configService.get('database.password') as any,
        database: configService.get('database.database') as any,
        schema: configService.get('database.schema') as any,
        entities: configService.get('database.entities') as any,
        synchronize: configService.get('database.synchronize') as any,
        charset: configService.get('database.charset') as any
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.mongoUri'),
      }),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    DepartamentosModule,
    CiudadesModule,
    CompaniasModule,
    UsuariosModule,
    ProductosModule,
    EventsModule,
    ScriptsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
