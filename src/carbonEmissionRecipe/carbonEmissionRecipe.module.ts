import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonEmissionRecipeController } from './carbonEmissionRecipe.controller';
import { CarbonEmissionRecipe } from './carbonEmissionRecipe.entity';
import { CarbonEmissionRecipeService } from './carbonEmissionRecipe.service';
import { RecipeIngredient } from './recipeIngredient.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CarbonEmissionRecipe,
            CarbonEmissionFactor,
            RecipeIngredient
        ])
    ],
    providers: [CarbonEmissionRecipeService],
    controllers: [CarbonEmissionRecipeController],
})
export class CarbonEmissionRecipeModule { }
