import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionRecipe } from "./carbonEmissionRecipe.entity";
import { CalculateCarbonEmissionRecipeDto } from "./dto/calculate-carbonEmissionRecipe.dto";
import { RecipeIngredient } from "./recipeIngredient.entity";

@Injectable()
export class CarbonEmissionRecipeService {
	private readonly logger = new Logger(CarbonEmissionRecipeService.name);

	constructor(
		@InjectRepository(CarbonEmissionRecipe)
		private carbonEmissionRecipeRepository: Repository<CarbonEmissionRecipe>
	) { }

	private calculateTotalEmission(ingredients: RecipeIngredient[]): number | null {
		let total = 0;

		for (const ingredient of ingredients) {
			const factorUnit = ingredient.carbonEmissionFactor.unit.toLowerCase();
			const ingredientUnit = ingredient.unit.toLowerCase();
			let convertedValue = ingredient.value;

			if (factorUnit !== ingredientUnit) {
				if (ingredientUnit === 'g' && factorUnit === 'kg') {
					this.logger.log(`Converting ${ingredient.value}g to kg for ${ingredient.carbonEmissionFactor.name}`);
					convertedValue = ingredient.value / 1000;
				} else if (ingredientUnit === 'kg' && factorUnit === 'g') {
					this.logger.log(`Converting ${ingredient.value}kg to g for ${ingredient.carbonEmissionFactor.name}`);
					convertedValue = ingredient.value * 1000;
				} else {
					this.logger.log(`Unknown unit, returning null`);
					return null;
				}
			}

			total += ingredient.carbonEmissionFactor.emissionCO2eInKgPerUnit * convertedValue;
		}

		return total;
	}

	async calculateAndSaveEmission(recipeId: number): Promise<CalculateCarbonEmissionRecipeDto> {
		const recipe = await this.carbonEmissionRecipeRepository.findOne({
			where: { id: recipeId },
			relations: {
				ingredients: {
					carbonEmissionFactor: true
				}
			}
		});

		if (!recipe) {
			throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
		}

		const totalEmission = this.calculateTotalEmission(recipe.ingredients);

		if (totalEmission === null) {
			throw new UnprocessableEntityException({
				status: 422,
				message: "Unable to calculate emission due to unknown unit conversion",
				success: false
			});
		}

		recipe.totalCarbonEmission = totalEmission;
		const savedRecipe = await this.carbonEmissionRecipeRepository.save(recipe);

		return CalculateCarbonEmissionRecipeDto.fromEntity(savedRecipe);
	}

	findAll(): Promise<CarbonEmissionRecipe[]> {
		return this.carbonEmissionRecipeRepository.find({
			relations: {
				ingredients: true
			}
		});
	}

	async findOne(id: number): Promise<CarbonEmissionRecipe> {
		const recipe = await this.carbonEmissionRecipeRepository.findOne({
			where: { id },
			relations: {
				ingredients: {
					carbonEmissionFactor: true
				}
			}
		});

		if (!recipe) {
			throw new NotFoundException(`Recipe with ID ${id} not found`);
		}

		return recipe;
	}
}