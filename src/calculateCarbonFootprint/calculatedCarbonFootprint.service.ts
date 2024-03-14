import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CalculatedCarbonFootprint } from "./calculatedCarbonFootprint.entity";

@Injectable()
export class CalculatedCarbonFootprintService {
    constructor(
        @InjectRepository(CalculatedCarbonFootprint)
        private calculatedCarbonFootprintRepository: Repository<CalculatedCarbonFootprint>,
        @InjectRepository(CarbonEmissionFactor)
        private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
      ) {}

async calculateCarbonFootprint(recipeName:string, ingredients:{name:string, unit:string, quantity:number}[]): 
Promise<{recipeName:string, sumOfCarbonFootprint:number} | null >{

  let sumOfCarbonFootprint: number  = 0
  for (let ingredient of ingredients){
    let findIngredients = await this.carbonEmissionFactorRepository.findOne(
    { where: { name: ingredient.name, unit: ingredient.unit }})
    
    if (!findIngredients) return null; 
    sumOfCarbonFootprint = sumOfCarbonFootprint + (ingredient.quantity * findIngredients.emissionCO2eInKgPerUnit);
     // console.log("Ingredients: ", findIngredients.emissionCO2eInKgPerUnit)
  }
    const calculatedCarbonFootprint = new CalculatedCarbonFootprint({recipe:recipeName, totalCarbonFootprint:sumOfCarbonFootprint})
    await this.calculatedCarbonFootprintRepository.save(calculatedCarbonFootprint);
    return {recipeName, sumOfCarbonFootprint}
  }

  findAll(): Promise<CalculatedCarbonFootprint[]> {
    return this.calculatedCarbonFootprintRepository.find();
  }
    
}