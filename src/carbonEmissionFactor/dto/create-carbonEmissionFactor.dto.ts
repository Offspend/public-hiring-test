import { ApiProperty } from '@nestjs/swagger';

import { CarbonEmissionFactorItem } from './shared/create-carbonEmissionFactorItem.dto';

export class CreateCarbonEmissionFactorDto {
  @ApiProperty({ type: [CarbonEmissionFactorItem] })
    items: CarbonEmissionFactorItem[];
}
