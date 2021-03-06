import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Http exception filters
   * @param exception
   * @param host
   */
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: status === 401 ? 'Invalid Credentials' : exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
