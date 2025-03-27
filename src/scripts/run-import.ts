import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ImportColombiaDataService } from './import-colombia-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const importService = app.get(ImportColombiaDataService);
  await importService.importData();
  await app.close();
}

bootstrap();
