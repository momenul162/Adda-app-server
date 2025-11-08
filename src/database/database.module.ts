import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('USER_NAME')}:${configService.get('DB_PASS')}@cluster0.phpiexj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
