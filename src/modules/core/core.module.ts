import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '@config/configuration';
import { ShortenerModule } from '@shortener/shortener/shortener.module';
import CoreController from '@shortener/core/core.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(configuration().database.url),
    ShortenerModule,
  ],
  controllers: [CoreController],
})
export default class CoreModule {}
