import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, 
  });


  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');


  const config = new DocumentBuilder()
    .setTitle('IZZZI API')
    .setDescription('API Documentation for IZZZI - Plateforme de recueil d\'avis étudiants')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('classes', 'Class management')
    .addTag('subjects', 'Subject management')
    .addTag('questionnaires', 'Questionnaire management')
    .addTag('notifications', 'Notifications and alerts')
    .addTag('payment', 'Stripe payment integration')
    .addTag('super-admin', 'Super admin operations')
    .addServer('http://localhost:4000', 'Development server')
    .addServer('https://api.izzzi.io', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
