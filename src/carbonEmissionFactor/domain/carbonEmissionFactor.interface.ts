import { Ingredient } from "./carbonEmissionFactor.model";
import { CarbonEmissionFactor } from "../carbonEmissionFactor.entity";

export const CARBON_EMISSION_FACTOR_PROVIDER  = 'CarbonEmissionFactorProvider';

export interface CarbonEmissionFactorProvider {
    findByIngredients(ingredients: Ingredient[]): Promise<CarbonEmissionFactor[]>
}