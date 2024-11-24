import { ApiProperty } from '@nestjs/swagger';

export class CarbonEmissionFactorItem {
  @ApiProperty()
    name: string;

  @ApiProperty()
    unit: string;

  @ApiProperty()
    emissionCO2eInKgPerUnit: number;

  @ApiProperty()
    source: string;
}
