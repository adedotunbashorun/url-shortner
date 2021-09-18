import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoint } from '@shortener/core/decorators/api-doc.decorator';

@Controller()
@ApiTags('Index')
export default class CoreController {
  @Get()
  @ApiEndpoint('Get "working" response', false)
  getHello(): string {
    return 'Working';
  }
}
