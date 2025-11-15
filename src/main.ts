import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
//  app.setGlobalPrefix('api/v1');
//  app.enableCors({
//     origin: 'http://localhost:3000', // change to your frontend origin
//     credentials: true,
//   });


  await app.listen(process.env.PORT ?? 3000);
  // app.setGlobalPrefix('/api/v1/auth')
}
bootstrap();



