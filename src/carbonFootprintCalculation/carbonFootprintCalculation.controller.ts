import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CarbonFootprintCalculation } from "./carbonFootprintCalculation.entity";
import { CarbonFootprintCalculationService } from "./carbonFootprintCalculation.service";
import { NotFoundInterceptor } from "./carbonFootprintCalculation.interceptor";
import { CreateCarbonFootprintCalculationDto } from "./dto/create-carbonFootprintCalculation.dto";
import { FoodProductNameDto } from "./dto/query-carbonFootprintCalculation.dto";

@Controller("carbon-footprint-calculation")
export class CarbonFootprintCalculationController {
  constructor(
    private readonly carbonFootprintCalculationService: CarbonFootprintCalculationService
  ) {}

  @Get()
  @ApiTags('carbon-footprint-calculation')
  getAllCarbonFootprintCalculations(): Promise<CarbonFootprintCalculation[]> {
    Logger.log(
      `[carbon-footprint-calculation] [GET] Getting all carbon footprint calculations`
    );
    return this.carbonFootprintCalculationService.findAll();
  }

  @Get('/filter')
  @ApiTags('carbon-footprint-calculation')
  @ApiNotFoundResponse()
  @UseInterceptors(NotFoundInterceptor)
  @ApiQuery({ name: 'foodProductName', required: true })
  getOneCarbonFootprintCalculationByFoodProductName(@Query() params: FoodProductNameDto): Promise<CarbonFootprintCalculation | null> {
    Logger.log(
        `[carbon-footprint-calculation] [GET] Getting carbon footprint calculation by filtering by: ${params.foodProductName}`
    );
    return this.carbonFootprintCalculationService.findByFoodProductName(params.foodProductName);
  }

  @Get(':id')
  @ApiTags('carbon-footprint-calculation')
  @ApiNotFoundResponse()
  @UseInterceptors(NotFoundInterceptor)
  getOneCarbonFootprintCalculationByID(@Param('id', ParseIntPipe) id: number): Promise<CarbonFootprintCalculation | null> {
    Logger.log(
        `[carbon-footprint-calculation] [GET] Getting carbon footprint calculation by ID: ${id}`
    );
    return this.carbonFootprintCalculationService.findById(id);
  }

  @Post()
  @ApiTags('carbon-footprint-calculation')
  @ApiCreatedResponse({
    description: 'The carbon footprint calculation has been successfully created.',
    type: CarbonFootprintCalculation,
  })
  @ApiBody({ type: CreateCarbonFootprintCalculationDto })
  async createOneCarbonFootprintCalculation(
    @Body() carbonFootprintCalculation: CreateCarbonFootprintCalculationDto
  ): Promise<CarbonFootprintCalculation> {
    Logger.log(
      `[carbon-footprint-calculation] [POST] Creating carbon footprint calculation : ${carbonFootprintCalculation} created`
    );

    return this.carbonFootprintCalculationService.create(carbonFootprintCalculation);
  }
}
