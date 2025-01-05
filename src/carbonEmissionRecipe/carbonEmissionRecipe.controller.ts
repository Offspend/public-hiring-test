import { Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CarbonEmissionRecipe } from './carbonEmissionRecipe.entity';
import { CarbonEmissionRecipeService } from './carbonEmissionRecipe.service';
import { CalculateCarbonEmissionRecipeDto } from './dto/calculate-carbonEmissionRecipe.dto';

@Controller('carbon-emission-recipes')
export class CarbonEmissionRecipeController {
    constructor(
        private readonly carbonEmissionRecipeService: CarbonEmissionRecipeService
    ) { }

    @Post(':id/calculate')
    calculateEmission(
        @Param('id') id: number
    ): Promise<CalculateCarbonEmissionRecipeDto> {
        Logger.log(
            `[carbon-emission-recipe] [POST] CarbonEmissionRecipe: calculating CarbonEmissionRecipe by its id`
        );
        return this.carbonEmissionRecipeService.calculateAndSaveEmission(id);
    }

    @Get()
    getCarbonEmissionRecipes(): Promise<CarbonEmissionRecipe[]> {
        Logger.log(
            `[carbon-emission-recipe] [GET] CarbonEmissionRecipe: getting all CarbonEmissionRecipes`
        );
        return this.carbonEmissionRecipeService.findAll();
    }

    @Get(':id')
    getCarbonEmissionRecipe(
        @Param('id') id: number
    ): Promise<CarbonEmissionRecipe> {
        Logger.log(
            `[carbon-emission-recipe] [GET] CarbonEmissionRecipe: getting one CarbonEmissionRecipe by its id`
        );
        return this.carbonEmissionRecipeService.findOne(id);
    }
}