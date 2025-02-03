import { Injectable } from '@nestjs/common';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonEmissionFactorsService } from '../carbonEmissionFactor/carbonEmissionFactors.service';
import { CarbonEmissionIngredientDto, CarbonEmissionRecipeDto } from './dto/carbon-emission-recipe-dto/carbon-emission-recipe-dto';

@Injectable()
export class CarbonEmissionRecipeService {
    constructor(private readonly emissionFactorService: CarbonEmissionFactorsService) { }

    async calculRecipeCarbonFootprint(recipe: CarbonEmissionRecipeDto): Promise<number> {
        let sumCarbonFootprint = 0;

        for (const ingredient of recipe.ingredients) {
            const footprint = await this.calculIngredientCarbonFootprint(ingredient);
            sumCarbonFootprint += footprint ?? 0; //If null, add 0 otherwise add footprint value
        }

        return Math.round(sumCarbonFootprint * 1000) / 1000; // Round to 3 digits.
    }

    private async calculIngredientCarbonFootprint(product: CarbonEmissionIngredientDto): Promise<number | null> {
        const matchingEf = await this.findMatchingEF(product.name, product.unit);
        return matchingEf ? matchingEf * product.quantity : null;
    }

    private async findMatchingEF(name: string, unit: string): Promise<number | null> {
        const result: CarbonEmissionFactor[] = await this.emissionFactorService.findAll();
        const matchingEf: CarbonEmissionFactor | undefined = result.find((entity) => entity.name === name &&
            entity.unit === unit);
        console.log("Matching Equivalent Footprint: ", matchingEf);
        console.log("For ", name);

        // If no matching equivalent emission footprint, then return null
        return matchingEf ? matchingEf.emissionCO2eInKgPerUnit : null;
    }
}
