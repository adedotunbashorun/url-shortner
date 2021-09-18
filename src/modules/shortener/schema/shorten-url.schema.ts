import { Document, SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';

import BaseModel from '@shortener/core/schema/base.schema';
import { BaseSchema } from '@shortener/core/schema/base.schema.decorator';
import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export type ShortenUrlDocument = ShortenUrl & Document;
const httpsRegex = /^(ftp|https?):\/\/+(www\.)?[a-z0-9\-\.]{3,}\.[a-z]{3}$/;

@BaseSchema()
export class ShortenUrl extends BaseModel {
  @ApiProperty({ description: 'feature config name' })
  @Prop({ type: String, required: true })
  @IsString()
  @IsUrl()
  @Matches(httpsRegex, {
    message: 'Please enter a valid url: http://... or https://...',
  })
  url?: string;

  @ApiProperty({ description: 'feature config name' })
  @IsNotEmpty()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'feature config enabled?' })
  @Prop({ type: String })
  shortenedUrl?: string;

  @ApiProperty({ description: 'feature config enabled?' })
  @Prop({ type: SchemaTypes.Mixed })
  analytics?: {
    uniqueVisit: [
      {
        ipAddress: string;
        device: [
          {
            name: string;
            countr: number;
          },
        ];
        count: number;
      },
    ]
  };

  @ApiProperty({ description: 'feature config deleted?' })
  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}

export class Code extends PickType(ShortenUrl, ['code'] as const) {}

export class Url extends PickType(ShortenUrl, ['url'] as const) {}

export const ShortenUrlSchema = SchemaFactory.createForClass(ShortenUrl);
