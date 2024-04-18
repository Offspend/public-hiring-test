import { Controller, Get, Logger, Param, Body, Post } from "@nestjs/common";
import { CarbonFootprintService } from "./carbonFootprint.service";
import { CarbonFootprint } from "./carbonFootprint.entity";
import { FoodProduct } from "./domain/FoodProduct";
import { FoodProductDto } from "./dto/FoodProduct";
import { Ingredient } from "./domain/Ingredient";

@Controller("carbon-footprint")
export class CarbonFootprintController {
  constructor(
    private readonly carbonFootprintService: CarbonFootprintService,
  ) {}

  @Get(":productName")
  findCarbonFootprint(
    @Param("productName") productName: string,
  ): Promise<CarbonFootprint> {
    Logger.log(
      `[carbon-footprint] [GET] CarbonFootprint: getting a carbon footprint for product name ${productName}`,
    );
    return this.carbonFootprintService.findByName(productName);
  }

  @Post()
  createCarbonFootprint(
    @Body() product: FoodProductDto,
  ): Promise<CarbonFootprint | null> {
    Logger.log(
      `[carbon-footprint] [POST] CarbonFootprint for product "${product.name}"`,
    );
    return this.carbonFootprintService.create(
      new FoodProduct(
        product.name,
        product.ingredients.map(
          (ingredient) =>
            new Ingredient(
              ingredient.name,
              ingredient.quantity,
              ingredient.unit,
            ),
        ),
      ),
    );
  }
}
