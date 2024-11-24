import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';

import { CarbonEmissionFactor } from './carbonEmissionFactor.entity';
import { CarbonEmissionFactorsService } from './carbonEmissionFactors.service';
import { CreateCarbonEmissionFactorDto } from './dto/create-carbonEmissionFactor.dto';
import { LoggerFactory } from '../appLogger/loggerFactory';

@Controller('carbon-emission-factors')
export class CarbonEmissionFactorsController {
  private readonly logger: LoggerService;

  constructor(
    private readonly carbonEmissionFactorService: CarbonEmissionFactorsService,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.createLogger('carbon-emission-factors');
  }

  @Get()
  getCarbonEmissionFactors(): Promise<CarbonEmissionFactor[]> {
    this.logger.log('[GET] CarbonEmissionFactor: getting all CarbonEmissionFactors');
    return this.carbonEmissionFactorService.findAll();
  }

  @Post()
  createCarbonEmissionFactors(
    @Body() carbonEmissionFactors: CreateCarbonEmissionFactorDto,
  ): Promise<CarbonEmissionFactor[] | null> {
    this.logger.log(`[POST] CarbonEmissionFactor: ${carbonEmissionFactors} created`);
    return this.carbonEmissionFactorService.save(carbonEmissionFactors);
  }
}
