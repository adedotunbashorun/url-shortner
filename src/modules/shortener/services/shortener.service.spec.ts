import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerService } from '@shortener/shortener/services/shortener.service';
import { ShortenUrl } from '@shortener/shortener/schema/shorten-url.schema';

class ApiServiceMock {
  generateShortenedUrl(dto: ShortenUrl) {
     return {};
  }
  get(code: string) {
    return {};
  }
  gotoOriginalUrl(req: unknown, code: string) {
    return '';
  }
}
describe('ShortenerService', () => {
  let service: ShortenerService;
  let module: TestingModule;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ShortenerService,
      useClass: ApiServiceMock,
    }
    module = await Test.createTestingModule({
      providers: [ShortenerService, ApiServiceProvider],
    }).compile();

    service = module.get<ShortenerService>(ShortenerService);
  });

  it('should call generateShortenedUrl method with expected payloads', async () => {
    const createShortenedSpy = jest.spyOn(service, 'generateShortenedUrl');
    const dto = new ShortenUrl();
    service.generateShortenedUrl(dto);
    expect(createShortenedSpy).toHaveBeenCalledWith(dto);
  });

  it('should call get method with expected param', async () => {
    const getSpy = jest.spyOn(service, 'get');
    const findOneOptions = "";
    service.get(findOneOptions);
    expect(getSpy).toHaveBeenCalledWith(findOneOptions);
  });

  it('should call gotoOriginalUrl method with expected params', async () => {
    const gotoSpy = jest.spyOn(service, 'gotoOriginalUrl');
    const code = '';
    const req: any = {};
    service.gotoOriginalUrl(req, code);
    expect(gotoSpy).toHaveBeenCalledWith(req, code);
  });

  afterAll(async () => {
    await module.close();
  });
});
