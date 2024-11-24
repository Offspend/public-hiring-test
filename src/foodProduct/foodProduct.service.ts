import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { FoodProduct } from './foodProduct.entity';
import { CarbonEmissionFactorsService } from '../carbonEmissionFactor/carbonEmissionFactors.service';
import { CreateFoodProductDto } from './dto/create-foodProduct.dto';
import { CarbonFootprintCalculatorService } from '../carbonFootprintCalculator/carbonFootprintCalculator.service';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';

@Injectable()
export class FoodProductService {
  constructor(
    @InjectRepository(FoodProduct)
    private readonly foodProductRepository: Repository<FoodProduct>,
    private readonly carbonEmissionFactorsService: CarbonEmissionFactorsService,
    private readonly carbonFootprintCalculatorService: CarbonFootprintCalculatorService,
  ) {}

  async save(foodProduct: CreateFoodProductDto, autoComputeCarbonFootprint: boolean): Promise<FoodProduct[] | null> {
    const toSave: FoodProduct[] = [];
    for (const product of foodProduct.items) {
      const base: Pick<FoodProduct, 'name' | 'recipe'> = {
        name: product.name,
        recipe: product.recipe,
      };
      if (autoComputeCarbonFootprint) {
        toSave.push(
          new FoodProduct({
            ...base,
            carbonFootprint: await this.getCarbonFootprintForRecipe(product.recipe),
          }),
        );
      } else {
        toSave.push(
          new FoodProduct({
            ...base,
            carbonFootprint: null,
          }),
        );
      }
    }
    return this.foodProductRepository.save(toSave);
  }

  findAll(): Promise<FoodProduct[]> {
    return this.foodProductRepository.find();
  }

  async computeAndSaveAllCarbonFootprint(): Promise<number> {
    const allToSave = await this.foodProductRepository.find({
      where: {
        carbonFootprint: IsNull(),
      },
    });
    let updated = 0;
    for (const carbonFootprint of allToSave) {
      carbonFootprint.carbonFootprint = await this.getCarbonFootprintForRecipe(carbonFootprint.recipe);
      await carbonFootprint.save();
      updated += 1;
    }
    return updated;
  }

  public async getCarbonFootprintForRecipe(recipe: {
    ingredients: {
      name: string;
      quantity: number;
      unit: string;
    }[];
  }): Promise<number> {
    const emissionFactorMap = await this.carbonEmissionFactorsService.getEmissionFactorMapByNames(
      recipe.ingredients.map((ingredient) => ingredient.name),
    );
    return this.getCarbonFootprintForRecipeWithMap(recipe, emissionFactorMap);
  }

  public async getCarbonFootprintForRecipeWithMap(
    recipe: {
      ingredients: {
        name: string;
        quantity: number;
        unit: string;
      }[];
    },
    emissionFactorMap: Map<string, CarbonEmissionFactor>,
  ): Promise<number> {
    return recipe.ingredients.reduce((partialSum, ingredient) => {
      const ingredientEmissionFactor = emissionFactorMap.get(ingredient.name);
      if (!ingredientEmissionFactor) {
        throw new Error(`Could not find emission factor with name "${ingredient.name}"`);
      }
      return (
        partialSum
        + this.carbonFootprintCalculatorService.computeCarbonFootprint(ingredientEmissionFactor.source, {
          unit: ingredient.unit,
          emissionCO2eInKgPerUnit: ingredientEmissionFactor.emissionCO2eInKgPerUnit,
          quantity: ingredient.quantity,
        })
      );
    }, 0);
  }
}
