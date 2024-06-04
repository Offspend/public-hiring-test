import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

@Controller("carbon-emission-factors")
export class CarbonEmissionFactorsController {
  constructor(
    private readonly carbonEmissionFactorService: CarbonEmissionFactorsService
  ) {}

  @Get()
  @ApiTags('carbon-emission-factors')
  getCarbonEmissionFactors(): Promise<CarbonEmissionFactor[]> {
    Logger.log(
      `[carbon-emission-factors] [GET] CarbonEmissionFactor: getting all CarbonEmissionFactors`
    );
    return this.carbonEmissionFactorService.findAll();
  }

  @Post()
  @ApiTags('carbon-emission-factors')
  @ApiCreatedResponse({
    description: 'The carbon emission factors have been successfully created.',
    type: CarbonEmissionFactor,
    isArray: true,
  })
  @ApiBody({ type: CreateCarbonEmissionFactorDto, isArray: true })
  createCarbonEmissionFactors(
    @Body() carbonEmissionFactors: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    ``;
    Logger.log(
      `[carbon-emission-factors] [POST] CarbonEmissionFactor: ${carbonEmissionFactors} created`
    );
    return this.carbonEmissionFactorService.save(carbonEmissionFactors);
  }
}
