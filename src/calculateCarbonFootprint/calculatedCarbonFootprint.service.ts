import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CalculatedCarbonFootprint } from "./calculatedCarbonFootprint.entity";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity"

@Injectable()
export class CalculatedCarbonFootprintService {
    constructor(
        @InjectRepository(CalculatedCarbonFootprint)
        private calculatedCarbonFootprintRepository: Repository<CalculatedCarbonFootprint>,
        @InjectRepository(CarbonEmissionFactor)
        private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
      ) {}

async calculateCarbonFootprint(ingredients:{name:string, unit:string, quantity:number}[]): Promise<number | null > {
  let sumOfCarbonFootprint: number  = 0
  for (let ingredient of ingredients){
    let findIngredients = await this.carbonEmissionFactorRepository.findOne(
      { where: { name: ingredient.name, unit: ingredient.unit }})
      
      if (!findIngredients) return null 

      sumOfCarbonFootprint = sumOfCarbonFootprint + (ingredient.quantity * findIngredients.emissionCO2eInKgPerUnit);
    }
    return sumOfCarbonFootprint
  }

  findAll(): Promise<CalculatedCarbonFootprint[]> {
    return this.calculatedCarbonFootprintRepository.find();
  }
    
}