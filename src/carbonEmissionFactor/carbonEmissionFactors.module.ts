import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";
import { CarbonEmissionFactorsController } from "./carbonEmissionFactors.controller";
import { CARBON_EMISSION_FACTOR_PROVIDER } from "./domain/carbonEmissionFactor.interface";

@Module({
  imports: [TypeOrmModule.forFeature([CarbonEmissionFactor])],
  providers: [
    CarbonEmissionFactorsService,
    {
      provide: CARBON_EMISSION_FACTOR_PROVIDER,
      useClass: CarbonEmissionFactorsService
    }
  ],
  controllers: [CarbonEmissionFactorsController],
  exports: [CARBON_EMISSION_FACTOR_PROVIDER],
})
export class CarbonEmissionFactorsModule {}
