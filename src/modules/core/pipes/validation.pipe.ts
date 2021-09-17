import {
  ValidationError,
  ValidationPipe as VP,
  ValidationPipeOptions,
} from '@nestjs/common';
import { merge } from 'lodash';

import { ValidationException } from '../exceptions/validation.exception';
import { UtilService } from '../services/UtilService';

export class ValidationPipe extends VP {
  constructor(options?: ValidationPipeOptions) {
    super(
      merge(
        {
          whitelist: false,
          forbidNonWhitelisted: false, // Turn on to block non whitelisted values
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
          exceptionFactory: (errors: ValidationError[]) => {
            const messages = UtilService.formatErrors(errors);

            return new ValidationException(messages);
          },
        },
        options,
      ),
    );
  }
}
