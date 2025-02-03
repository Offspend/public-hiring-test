import { Body, Controller, Post } from '@nestjs/common';
import { CarbonEmissionRecipeService } from './carbon-emission-recipe.service';
import { CarbonEmissionRecipeDto } from './dto/carbon-emission-recipe-dto/carbon-emission-recipe-dto';

@Controller('carbon-footprint')
export class CarbonEmissionRecipeController {
    constructor(private readonly service: CarbonEmissionRecipeService) { }

    @Post()
    async calculateFootprint(@Body() recipe: CarbonEmissionRecipeDto): Promise<number> {
        return this.service.calculRecipeCarbonFootprint(recipe);
    }
}
