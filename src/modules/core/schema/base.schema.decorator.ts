import { applyDecorators } from '@nestjs/common';
import { Schema, SchemaOptions } from '@nestjs/mongoose';

export const BaseSchema = (options?: SchemaOptions): any =>
  applyDecorators(
    Schema(
      options || {
        timestamps: true,
        toJSON: {
          virtuals: true,
          transform: (_doc: any, ret: any): void => {
            delete ret._id;
            delete ret.__v;
          },
        },
        toObject: {
          virtuals: true,
        },
      },
    ),
  );
