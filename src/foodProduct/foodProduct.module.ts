import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {FoodProduct} from "./foodProduct.entity";
import {CarbonEmissionFactorsModule} from "../carbonFootprintCalculator/carbonFootprintCalculator.module";

@Module({
  imports: [TypeOrmModule.forFeature([FoodProduct]), CarbonEmissionFactorsModule, CarbonEmissionFactorsModule],
  providers: [],
  controllers: [],
})
export class FoodProductModule {}
