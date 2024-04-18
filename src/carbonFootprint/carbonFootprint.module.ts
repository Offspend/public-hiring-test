import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonFootprint } from "./carbonFootprint.entity";
import { CarbonFootprintService } from "./carbonFootprint.service";
import { CarbonFootprintController } from "./carbonFootprint.controller";
import { AgrybaliseCarbonFootprintCalculatorService } from "./agrybaliseCarbonFootprintCalculator.service";
import { CarbonEmissionFactorsModule } from "../carbonEmissionFactor/carbonEmissionFactors.module";

@Module({
  imports: [TypeOrmModule.forFeature([CarbonFootprint])],
  providers: [
    CarbonFootprintService,
    {
      provide: "CarbonFootprintCalculator",
      useClass: AgrybaliseCarbonFootprintCalculatorService,
    },
    {
      provide: "ICarbonEmissionFactorsService",
      useClass: CarbonEmissionFactorsModule,
    },
  ],
  controllers: [CarbonFootprintController],
})
export class CarbonFootprintModule {}
