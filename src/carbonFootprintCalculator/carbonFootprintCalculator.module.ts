import { Module } from "@nestjs/common";
import { CarbonEmissionFactorsModule } from "../carbonEmissionFactor/carbonEmissionFactors.module";
import { AgrybaliseCarbonFootprintCalculatorService } from "./agrybaliseCarbonFootprintCalculator.service";
import {
    CARBON_FOOTPRINT_CALCULATOR,
} from "./domain/carbonFootprintCalculator.interface";

@Module({
    imports: [
        CarbonEmissionFactorsModule,
    ],
    providers: [{
        provide: CARBON_FOOTPRINT_CALCULATOR,
        useClass: AgrybaliseCarbonFootprintCalculatorService
    }],
    exports: [CARBON_FOOTPRINT_CALCULATOR],
})
export class CarbonFootprintCalculatorModule {
}
