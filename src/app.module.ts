import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeorm } from "../config/dataSource";
import { CarbonEmissionFactorsModule } from "./carbonEmissionFactor/carbonEmissionFactors.module";
import {CarbonFootprintCalculatorModule} from "./carbonFootprintCalculator/carbonFootprintCalculator.module";
import {FoodProductModule} from "./foodProduct/foodProduct.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow("typeorm"),
    }),
    CarbonFootprintCalculatorModule,
    CarbonEmissionFactorsModule,
    FoodProductModule,
  ],
})
export class AppModule {}
