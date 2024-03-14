import { Body, Controller, Get, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CalculatedCarbonFootprint } from "./calculatedCarbonFootprint.entity";
import { CalculatedCarbonFootprintService } from "./calculatedCarbonFootprint.service";

@Controller("carbon-footprint")
export class CalculatedCarbonFootprintController {
    constructor(
      private readonly calculatedCarbonFootprintService: CalculatedCarbonFootprintService,
      @InjectRepository(CalculatedCarbonFootprint)
      private calculatedCarbonFootprintRepository: Repository<CalculatedCarbonFootprint>
    ) {}

    @Post('calculate')
    async initiateCalculateCarbonFootprint(@Body() 
    requestData: { recipeName: string, ingredients:{ name: string, unit: string, quantity: number }[]}): 
    Promise<{recipeName:string, totalCarbon:number}  | null | string>{
      const { recipeName, ingredients } = requestData;

      let findRecipe = await this.calculatedCarbonFootprintRepository.findOne({where:{ recipe: recipeName}});
      if (findRecipe){
        return "Recipe Already Exists"
      }
      const  totalCarbonFootprint = await this.calculatedCarbonFootprintService.calculateCarbonFootprint(recipeName,ingredients)
      if (totalCarbonFootprint === null){
        return "Cannot Calculate Carbon Footprint"
      }
      return {recipeName, totalCarbon:totalCarbonFootprint.sumOfCarbonFootprint};
    }

    @Get()
    getAllCarbonFootprints(): Promise<CalculatedCarbonFootprint[]>{
      return this.calculatedCarbonFootprintService.findAll();
    }

  }