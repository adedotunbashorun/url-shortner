import { ApiProperty } from '@nestjs/swagger';

export default class BaseModel {
  @ApiProperty({
    type: String,
    description: 'id virtual',
  })
  id?: string;

  @ApiProperty({
    description: 'createdAt',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'updatedAt',
  })
  updatedAt?: Date;
}
