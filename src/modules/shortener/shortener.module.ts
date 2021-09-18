import { Module } from '@nestjs/common';
import { ShortenerService } from '@shortener/shortener/services/shortener.service';
import { ShortenerController } from '@shortener/shortener/controllers/shortener.controller';
import { SCHEMAS } from '@shortener/core/constants';
import { ShortenUrlSchema } from './schema/shorten-url.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SCHEMAS.SHORTEN_URL, schema: ShortenUrlSchema },
    ]),
  ],
  providers: [ShortenerService],
  controllers: [ShortenerController],
})
export class ShortenerModule {}
