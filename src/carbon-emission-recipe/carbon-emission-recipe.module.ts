import { Module } from '@nestjs/common';
import { CarbonEmissionRecipeController } from './carbon-emission-recipe.controller';
import { CarbonEmissionFactorsModule } from '../carbonEmissionFactor/carbonEmissionFactors.module';
import { CarbonEmissionRecipeService } from './carbon-emission-recipe.service';

@Module({
    imports: [CarbonEmissionFactorsModule],
    controllers: [CarbonEmissionRecipeController],
    providers: [CarbonEmissionRecipeService]
})
export class CarbonEmissionRecipeModule {}
