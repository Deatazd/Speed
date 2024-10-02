// src/app.module.ts

import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule globally available
      envFilePath: '.env', // Specify the path to .env file
    }),
    // Configure MongooseModule to use the MongoDB URI from environment variables
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        Logger.log(`MongoDB URI: ${uri}`, 'MongooseModule'); // Log the URI for debugging
        if (!uri) {
          Logger.error(
            'MONGODB_URI is not defined in environment variables',
            'MongooseModule',
          );
          throw new Error(
            'MONGODB_URI is not defined in environment variables',
          );
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    // Import your other modules
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
