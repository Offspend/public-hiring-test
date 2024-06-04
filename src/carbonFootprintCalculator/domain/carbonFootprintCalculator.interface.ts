import { CarbonFootprintCalculatorIngredient } from "./carbonFootprintCalculator.model";

export const CARBON_FOOTPRINT_CALCULATOR  = 'CarbonFootprintCalculator';

export interface CarbonFootprintCalculator {
    calculateCarbonFootprintOfIngredients(
        ingredients: CarbonFootprintCalculatorIngredient[]
    ): Promise<number | null>
}