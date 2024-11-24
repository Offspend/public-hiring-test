import { Module } from "@nestjs/common";
import {CarbonFootprintCalculatorService} from "./carbonFootprintCalculator.service";

@Module({
  imports: [],
  providers: [CarbonFootprintCalculatorService],
  controllers: [],
  exports: [CarbonFootprintCalculatorService],
})
export class CarbonFootprintCalculatorModule {}
