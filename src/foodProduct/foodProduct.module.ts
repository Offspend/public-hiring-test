import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FoodProduct } from './foodProduct.entity';
import { CarbonFootprintCalculatorModule } from '../carbonFootprintCalculator/carbonFootprintCalculator.module';
import { FoodProductController } from './foodProduct.controller';
import { CarbonEmissionFactorsModule } from '../carbonEmissionFactor/carbonEmissionFactors.module';
import { AppLoggerModule } from '../appLogger/appLoger.module';
import { FoodProductService } from './foodProduct.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodProduct]),
    CarbonEmissionFactorsModule,
    CarbonFootprintCalculatorModule,
    AppLoggerModule,
  ],
  providers: [FoodProductService],
  controllers: [FoodProductController],
})
export class FoodProductModule {}
