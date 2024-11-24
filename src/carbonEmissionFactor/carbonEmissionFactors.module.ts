import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarbonEmissionFactor } from './carbonEmissionFactor.entity';
import { CarbonEmissionFactorsService } from './carbonEmissionFactors.service';
import { CarbonEmissionFactorsController } from './carbonEmissionFactors.controller';
import { AppLoggerModule } from '../appLogger/appLoger.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarbonEmissionFactor]), AppLoggerModule],
  providers: [CarbonEmissionFactorsService],
  controllers: [CarbonEmissionFactorsController],
  exports: [CarbonEmissionFactorsService],
})
export class CarbonEmissionFactorsModule {}
