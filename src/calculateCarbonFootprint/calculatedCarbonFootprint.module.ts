import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CalculatedCarbonFootprint } from "./calculatedCarbonFootprint.entity";
import { CalculatedCarbonFootprintService } from "./calculatedCarbonFootprint.service";
import { CalculatedCarbonFootprintController } from "./calculatedCarbonFootprint.controller";
import { CarbonEmissionFactorsModule } from "../carbonEmissionFactor/carbonEmissionFactors.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CalculatedCarbonFootprint, CarbonEmissionFactor]),
    CarbonEmissionFactorsModule,
  ],
  providers: [
    CalculatedCarbonFootprintService,
  ],
  controllers: [CalculatedCarbonFootprintController],
})
export class CalculatedCarbonFootprintModule {}
