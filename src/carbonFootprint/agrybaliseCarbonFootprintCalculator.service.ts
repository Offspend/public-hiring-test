import { ICarbonEmissionFactorsService } from "src/carbonEmissionFactor/carbonEmissionFactors.service";
import { FoodProduct } from "./domain/FoodProduct";
import { Ingredient } from "./domain/Ingredient";

export class CarbonFootprint {
  constructor(
    public readonly weight: number | null,
    public readonly unit: "kg" = "kg",
  ) {}
}

class CarbonEmissionFactorNotFoundError extends Error {
  constructor(public readonly ingredient: Ingredient) {
    super(`Carbon emission factor not found for "${ingredient.name}"`);
  }
}

interface CarbonFootprintCalculator {
  calculate(product: FoodProduct): Promise<CarbonFootprint>;
}

export class AgrybaliseCarbonFootprintCalculatorService
  implements CarbonFootprintCalculator
{
  constructor(
    private readonly carbonEmissionFactorsService: ICarbonEmissionFactorsService,
  ) {}

  async calculate(product: FoodProduct): Promise<CarbonFootprint> {
    try {
      const carbonEmissionFactors =
        await this.findCarbonEmissionFactors(product);

      const totalWeight = carbonEmissionFactors.reduce((weight, factor) => {
        const ingredient = product.findIngredient(factor.name);
        return weight + ingredient.quantity * factor.emissionCO2eInKgPerUnit;
      }, 0);

      return new CarbonFootprint(totalWeight);
    } catch (error) {
      if (error instanceof CarbonEmissionFactorNotFoundError) {
        return new CarbonFootprint(null);
      }
      throw error;
    }
  }

  private async findCarbonEmissionFactors(product: FoodProduct) {
    // TODO: this does not scale with a large number of carbon emission factors
    // also CarbonEmissionFactorService could have a method to get the factors from a Product
    const carbonEmissionFactors =
      await this.carbonEmissionFactorsService.findAll();

    const carbonFootprints = product.ingredients.map((ingredient) => {
      const factor = carbonEmissionFactors.find(
        (factor) => factor.name === ingredient.name,
      );

      if (!factor) {
        throw new CarbonEmissionFactorNotFoundError(ingredient);
      }
      return factor;
    });

    return carbonFootprints;
  }
}
