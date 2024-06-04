import { ConflictException, Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonFootprintCalculation } from "./carbonFootprintCalculation.entity";
import {
  CreateCarbonFootprintCalculationDto,
  SaveCarbonFootprintCalculationDto,
} from "./dto/create-carbonFootprintCalculation.dto";
import {
  CARBON_FOOTPRINT_CALCULATOR,
  CarbonFootprintCalculator
} from "../carbonFootprintCalculator/domain/carbonFootprintCalculator.interface";

@Injectable()
export class CarbonFootprintCalculationService{
  constructor(
    @InjectRepository(CarbonFootprintCalculation)
    private readonly carbonEmissionFactorRepository: Repository<CarbonFootprintCalculation>,
    @Inject(CARBON_FOOTPRINT_CALCULATOR)
    private readonly carbonFootprintCalculator: CarbonFootprintCalculator,
  ) {}

  findAll(): Promise<CarbonFootprintCalculation[]> {
    return this.carbonEmissionFactorRepository.find();
  }

  findByFoodProductName(
      foodProductName: string
  ): Promise<CarbonFootprintCalculation | null> {
    return this.carbonEmissionFactorRepository.findOneBy({
      foodProductName: foodProductName,
    });
  }

  findById(
      id: number
  ): Promise<CarbonFootprintCalculation | null> {
    return this.carbonEmissionFactorRepository.findOneBy({
      id: id,
    });
  }

  async create(
      footprintCalculationDto: CreateCarbonFootprintCalculationDto
  ): Promise<CarbonFootprintCalculation> {
    const currentCalculation = await this.findByFoodProductName(footprintCalculationDto.foodProductName)

    if (currentCalculation !== null) {
      throw new ConflictException(`Carbon footprint calculation for food product ${footprintCalculationDto.foodProductName} already exists`);
    }

    const productFootprintCalculation = await this.carbonFootprintCalculator.calculateCarbonFootprintOfIngredients(footprintCalculationDto.ingredients)

    return this.save({
        foodProductName: footprintCalculationDto.foodProductName,
        ingredients: footprintCalculationDto.ingredients,
        carbonFootprint: productFootprintCalculation,
    });
  }

  save(
    carbonFootprintCalculation: SaveCarbonFootprintCalculationDto,
  ): Promise<CarbonFootprintCalculation> {
    return this.carbonEmissionFactorRepository.save(carbonFootprintCalculation);
  }
}
