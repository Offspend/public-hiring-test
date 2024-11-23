import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {FoodProduct} from "./foodProduct.entity";
import {CarbonEmissionFactorsService} from "../carbonEmissionFactor/carbonEmissionFactors.service";
import {CreateFoodProductDto} from "./dto/create-foodProduct.dto";
import {CarbonFootprintCalculatorService} from "../carbonFootprintCalculator/carbonFootprintCalculator.service";

@Injectable()
export class FoodProductService {
  constructor(
          @InjectRepository(FoodProduct)
          private readonly foodProductRepository: Repository<FoodProduct>,
          private readonly carbonEmissionFactorsService: CarbonEmissionFactorsService,
          private readonly carbonFootprintCalculatorService: CarbonFootprintCalculatorService,
  ) {}

  async save(
          foodProduct: CreateFoodProductDto[],
          autoComputeCarbonFootprint: boolean,
  ): Promise<FoodProduct[] | null> {
    const toSave: FoodProduct[] = [];
    for (const product of foodProduct) {
      const base: Pick<FoodProduct, 'name' | 'recipe'> = {
        name: product.name,
        recipe: product.recipe,
      }
      if (autoComputeCarbonFootprint) {
        toSave.push(new FoodProduct({
          ...base,
          carbonFootprint: null,
        }))
      } else {
        toSave.push(new FoodProduct({
          ...base,
          carbonFootprint: await this.getCarbonFootprintForRecipe(product.recipe),
        }))
      }
    }
    return this.foodProductRepository.save(toSave);
  }

  findAll(): Promise<FoodProduct[]> {
    return this.foodProductRepository.find();
  }

  async computeCarbonFootprint(product: FoodProduct): Promise<void> {
    product.carbonFootprint = await this.getCarbonFootprintForRecipe(product.recipe)
  }

  private async getCarbonFootprintForRecipe(recipe: {
    ingredients: {
      name: string;
      quantity: number;
      unit: string;
    }[]
  }): Promise<number> {
    const emissionFactorMap = await this.carbonEmissionFactorsService.getEmissionFactorMapByNames(
            recipe.ingredients.map((ingredient) => ingredient.name)
    );
    return recipe.ingredients.reduce((partialSum, ingredient) => {
      const ingredientEmissionFactor = emissionFactorMap.get(ingredient.name);
      if (!ingredientEmissionFactor) {
        throw new Error(`Could not find ingredient ${ingredient.name}`);
      }
      return partialSum + this.carbonFootprintCalculatorService.computeCarbonFootprint(ingredientEmissionFactor.source, {
        unit: ingredient.unit,
        emissionCO2eInKgPerUnit: ingredientEmissionFactor.emissionCO2eInKgPerUnit,
        quantity: ingredient.quantity,
      })
    }, 0);
  }
}
