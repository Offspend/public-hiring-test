import { ArrayNotEmpty, IsArray, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CarbonFootprintCalculatorIngredient
} from "../../carbonFootprintCalculator/domain/carbonFootprintCalculator.model";

export class CreateCarbonFootprintCalculationDto {
  @IsString()
  foodProductName: string;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CarbonFootprintCalculationIngredientDto)
  @ValidateNested()
  ingredients: CarbonFootprintCalculationIngredientDto[];
}

export class CarbonFootprintCalculationIngredientDto {
  @IsString()
  name: string;

  @IsPositive()
  quantity: number;

  @IsString()
  unit: string;
}

export class SaveCarbonFootprintCalculationDto {
  foodProductName: string;
  ingredients: CarbonFootprintCalculatorIngredient[];
  carbonFootprint: number | null;
}