/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerController } from '@shortener/shortener/controllers/shortener.controller';
import { ShortenerService } from '@shortener/shortener/services/shortener.service';
import { ShortenUrl } from '@shortener/shortener/schema/shorten-url.schema';

describe('ShortenerController Unit Tests', () => {
  let controller: ShortenerController;
  let spyService: ShortenerService;
  let app: TestingModule;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ShortenerService,
      useFactory: () => ({
        generateShortenedUrl: jest.fn(() => {}),
        get: jest.fn(() => {}),
        gotoOriginalUrl: jest.fn(() => {}),
      }),
    };
    app = await Test.createTestingModule({
      controllers: [ShortenerController],
      providers: [ShortenerService, ApiServiceProvider],
    }).compile();

    controller = app.get<ShortenerController>(ShortenerController);
    spyService = app.get<ShortenerService>(ShortenerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling generateShortenedUrl method it encode the url', () => {
    const dto = new ShortenUrl();
    expect(controller.create(dto)).not.toEqual(null);
  });

  it('calling generateShortenedUrl method it encode the url', () => {
    const dto = new ShortenUrl();
    controller.create(dto);
    expect(spyService.generateShortenedUrl).toHaveBeenCalled();
    expect(spyService.generateShortenedUrl).toHaveBeenCalledWith(dto);
  });

  it('calling decode shortened url method', () => {
    const dto = new ShortenUrl();
    dto.code = '3789';
    controller.decode(dto);
    expect(spyService.get).toHaveBeenCalled();
  });

  it('calling get statistics of shortened url method', () => {
    const code = '3789';
    controller.getStats(code);
    expect(spyService.get).toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
