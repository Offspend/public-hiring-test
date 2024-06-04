import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonFootprintCalculation } from "./carbonFootprintCalculation.entity";
import { CarbonFootprintCalculationService } from "./carbonFootprintCalculation.service";
import { CarbonFootprintCalculationController } from "./carbonFootprintCalculation.controller";
import { CarbonFootprintCalculatorModule } from "../carbonFootprintCalculator/carbonFootprintCalculator.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([CarbonFootprintCalculation]),
        CarbonFootprintCalculatorModule,
    ],
    providers: [CarbonFootprintCalculationService],
    controllers: [CarbonFootprintCalculationController],
})
export class CarbonFootprintCalculationModule {
}
