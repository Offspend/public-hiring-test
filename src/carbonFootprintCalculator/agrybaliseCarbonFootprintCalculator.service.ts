import {Inject, Injectable} from "@nestjs/common";
import Decimal from 'decimal.js';
import { CarbonFootprintCalculatorIngredient } from "./domain/carbonFootprintCalculator.model";
import { CarbonFootprintCalculator } from "./domain/carbonFootprintCalculator.interface";
import {
  CARBON_EMISSION_FACTOR_PROVIDER,
  CarbonEmissionFactorProvider
} from "../carbonEmissionFactor/domain/carbonEmissionFactor.interface";
import { Ingredient } from "../carbonEmissionFactor/domain/carbonEmissionFactor.model";

@Injectable()
export class AgrybaliseCarbonFootprintCalculatorService implements CarbonFootprintCalculator {
  constructor(
    @Inject(CARBON_EMISSION_FACTOR_PROVIDER)
    private carbonEmissionFactorProvider: CarbonEmissionFactorProvider,
  ) {}

  async calculateCarbonFootprintOfIngredients(
    ingredients: CarbonFootprintCalculatorIngredient[]
  ): Promise<number | null> {
    const ingredientsQueryDto: Ingredient[] = ingredients.map((ingredient) => {
        return {
            name: ingredient.name,
            unit: ingredient.unit,
        };
    });

    const ingredientsEmissionFactor = await this.carbonEmissionFactorProvider.findByIngredients(ingredientsQueryDto)

    const emissionsByIngredient = ingredients.map((ingredient) => {
      const emissionFactor = ingredientsEmissionFactor.find(
          (factor) => factor.name === ingredient.name && factor.unit === ingredient.unit
      );

      if (!emissionFactor) {
        return null;
      }

      return ingredient.quantity * emissionFactor.emissionCO2eInKgPerUnit;
    });

    if (emissionsByIngredient.includes(null)) {
      return null;
    }

    // Floating-point numbers in Typescript are represented using the IEEE 754 standard
    // This can lead to precision errors in certain arithmetic operations.
    // Read https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html for more details
    // To avoid this, we use the Decimal.js library (https://github.com/MikeMcl/decimal.js) to perform arithmetic operations
    // @ts-ignore we already manage null values before
    return emissionsByIngredient.reduce((sum, current) => new Decimal(sum).plus(new Decimal(current)), 0).toNumber();
  }
}
