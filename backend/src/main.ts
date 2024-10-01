import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS
  app.enableCors({
    origin: 'http://localhost:3000', // 允许来自前端服务器的请求
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // 明确允许的方法
    allowedHeaders: 'Content-Type, Authorization', // 明确允许的头部
    credentials: true, // 如果需要发送 cookies 或 authentication headers，设置为 true
    preflightContinue: false, // 如果希望应用处理 OPTIONS 请求，设置为 false
  });

  const port = process.env.PORT || 8082;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
