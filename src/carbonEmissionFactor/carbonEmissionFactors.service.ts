import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";
import {CarbonEmissionFactorProvider} from "./domain/carbonEmissionFactor.interface";
import { Ingredient } from "./domain/carbonEmissionFactor.model";

@Injectable()
export class CarbonEmissionFactorsService implements CarbonEmissionFactorProvider {
  constructor(
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
  ) {}

  findAll(): Promise<CarbonEmissionFactor[]> {
    return this.carbonEmissionFactorRepository.find();
  }

  findByIngredients(ingredients: Ingredient[]): Promise<CarbonEmissionFactor[]> {
    return this.carbonEmissionFactorRepository.find({
      where: ingredients,
    })
  }

  save(
    carbonEmissionFactor: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    return this.carbonEmissionFactorRepository.save(carbonEmissionFactor);
  }
}
