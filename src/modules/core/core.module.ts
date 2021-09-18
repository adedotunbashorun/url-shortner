import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '@shortener/config/configuration';
import { ShortenerModule } from '@shortener/shortener/shortener.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(configuration().database.url),
    ShortenerModule,
  ],
  controllers: [],
})
export default class CoreModule {}
