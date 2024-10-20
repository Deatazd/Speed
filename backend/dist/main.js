"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    console.log('Starting application bootstrap...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Articles API')
        .setDescription('API documentation for Articles module')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    app.enableCors({
        origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const port = configService.get('PORT') || 8082;
    console.log(`Application is listening on port ${port}...`);
    try {
        await app.listen(port);
        console.log('Application started successfully');
    }
    catch (error) {
        console.error('Error starting application:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map