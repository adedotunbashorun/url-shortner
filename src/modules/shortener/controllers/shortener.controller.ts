import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiEndpoint } from '@shortener/core/decorators/api-doc.decorator';

import { Request, Response } from 'express';

import {
  ShortenUrl,
  ShortenUrlDocument,
} from '@shortener/shortener/schema/shorten-url.schema';
import { ShortenerService } from '../services/shortener.service';
import { ValidationPipe } from '@shortener/core/pipes/validation.pipe';

@Controller('')
@ApiTags('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @ApiEndpoint('create url shortener')
  @ApiResponse({
    status: 201,
    description: 'url shortened successful',
  })
  @Post('encode')
  public async create(
    @Body(ValidationPipe) payload: ShortenUrl,
  ): Promise<ShortenUrlDocument> {
    return this.shortenerService.generateShortenedUrl(payload);
  }

  @ApiEndpoint('return url')
  @ApiResponse({
    status: 201,
    description: 'return shortened url successful',
  })
  @Post('decode')
  public async decode(@Body() payload: { code: string }): Promise<string> {
    return this.shortenerService.get(payload.code);
  }

  @ApiEndpoint('redirect to original url and keep starts')
  @ApiResponse({
    status: 201,
    description: 'goto original url and keep stats',
  })
  @Get(':code')
  public async get(
    @Req() req: Request,
    @Res() res: Response,
    @Param('code') code: string,
  ): Promise<void> {
    const url = await this.shortenerService.gotoOriginalUrl(req, code);

    return res.redirect(url.url.toString());
  }
}
