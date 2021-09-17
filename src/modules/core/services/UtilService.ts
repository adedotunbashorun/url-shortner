/* eslint-disable no-restricted-properties */
import { Injectable, ValidationError } from '@nestjs/common';

@Injectable()
export class UtilService {
  static randomString(length: number): string {
    return Math.round(
      Math.pow(36, length + 1) - Math.random() * Math.pow(36, length),
    )
      .toString(36)
      .slice(1);
  }

  static formatErrors(errorsToFromat: ValidationError[]): { [x: string]: any } {
    return errorsToFromat.reduce(
      (accumulator: Record<string, unknown>, error: ValidationError) => {
        let constraints: any;
        if (Array.isArray(error.children) && error.children.length) {
          constraints = UtilService.formatErrors(error.children);
        } else {
          const hasContraints = !!error.constraints;
          if (hasContraints) {
            let items = Object.values(error.constraints);
            const lastItem = items.pop();
            items = [items.join(', '), lastItem].filter((item) => item);
            constraints = items.join(' and ');
          } else {
            constraints = '';
          }
        }
        return {
          ...accumulator,
          [error.property]: constraints,
        };
      },
      {},
    );
  }
}
