// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // 启用全局验证管道
    app.useGlobalPipes(new ValidationPipe());

    // 配置 Swagger（可选）
    const config = new DocumentBuilder()
        .setTitle('Articles API')
        .setDescription('API documentation for Articles module')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    // 配置 CORS
    app.enableCors({
        origin: configService.get<string>('FRONTEND_URL') || 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    await app.listen(configService.get<number>('PORT') || 8082);
}
bootstrap();
