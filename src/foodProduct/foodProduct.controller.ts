import {Body, Controller, Get, HttpCode, Post} from "@nestjs/common";
import {FoodProductService} from "./foodProduct.service";
import {FoodProduct} from "./foodProduct.entity";
import {CreateFoodProductDto} from "./dto/create-foodProduct.dto";
import {LoggerFactory} from "../appLogger/loggerFactory";
import {LoggerService} from "@nestjs/common/services/logger.service";
import {ComputeFoodProductCarbonFootprintDto} from "./dto/computeFoodProductCarbonFootprint.dto";

@Controller("food-products")
export class FoodProductController {
  private readonly logger: LoggerService;

  constructor(
          private readonly foodProductService: FoodProductService,
          loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.createLogger("food-product");
  }

  @Get()
  getFoodProducts(): Promise<FoodProduct[]> {
    this.logger.log(
            `[GET] FoodProduct: getting all FoodProducts`
    );
    return this.foodProductService.findAll();
  }

  @Post()
  createFoodProducts(
          @Body() foodProducts: CreateFoodProductDto
  ): Promise<FoodProduct[] | null> {
    this.logger.log(
            `[POST] FoodProduct: ${foodProducts} created`
    );
    return this.foodProductService.save(foodProducts, true);
  }

  @Post('compute-and-save-all')
  @HttpCode(200)
  computeAndSaveAllCarbonFootprint(): Promise<number> {
    this.logger.log(
            `[POST] FoodProduct: computeAndSaveAllCarbonFootprint`
    );
    return this.foodProductService.computeAndSaveAllCarbonFootprint();
  }

  @Post('compute-carbon-footprint')
  @HttpCode(200)
  async computeCarbonFootprint(
          @Body() computeFoodProductCarbonFootprintDto: ComputeFoodProductCarbonFootprintDto
  ): Promise<{
    carbonFootprint: number;
  }> {
    this.logger.log(
            `[POST] Footprint calculated`
    );
    return {
      carbonFootprint: await this.foodProductService.getCarbonFootprintForRecipe(computeFoodProductCarbonFootprintDto.recipe),
    };
  }
}
