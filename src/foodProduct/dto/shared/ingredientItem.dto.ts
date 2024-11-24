import { ApiProperty } from '@nestjs/swagger';

export class IngredientItem {
  @ApiProperty()
    name: string;

  @ApiProperty()
    quantity: number;

  @ApiProperty()
    unit: string;
}
