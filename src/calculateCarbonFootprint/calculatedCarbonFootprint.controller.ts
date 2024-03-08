import { Body, Controller, Post, Get } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CalculatedCarbonFootprintService } from "./calculatedCarbonFootprint.service";
import { CalculatedCarbonFootprint } from "./calculatedCarbonFootprint.entity";
import { Repository } from "typeorm";
import { Index } from "typeorm";

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
    Promise<{ recipeName: string, totalCarbonFootprint: number | null }>{
      let { recipeName, ingredients } = requestData;
      let totalCarbonFootprint = await this.calculatedCarbonFootprintService.calculateCarbonFootprint(ingredients)

      if (totalCarbonFootprint === null){
        totalCarbonFootprint = 0
      }
      
      let calculatedCarbonFootprint = new CalculatedCarbonFootprint(recipeName, totalCarbonFootprint)
      await this.calculatedCarbonFootprintRepository.save(calculatedCarbonFootprint);

      return {recipeName, totalCarbonFootprint}
    }

    @Get()
    getAllCarbonFootprints(): Promise<CalculatedCarbonFootprint[]>{
      return this.calculatedCarbonFootprintService.findAll();
    }

  }