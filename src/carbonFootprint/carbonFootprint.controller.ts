import { Controller, Get, Logger, Param } from "@nestjs/common";
import { CarbonFootprintService } from "./carbonFootprint.service";
import { CarbonFootprint } from "./carbonFootprint.entity";

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
}
