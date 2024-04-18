import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonFootprint } from "./carbonFootprint.entity";
import { CarbonFootprintCalculator } from "./agrybaliseCarbonFootprintCalculator.service";
import { FoodProduct } from "./domain/FoodProduct";

export class CarbonFootprintNotFound extends HttpException {
  constructor(productName: string) {
    super(
      `Carbon footprint not found for product name "${productName}"`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CarbonFootprintAlreadyExist extends HttpException {
  constructor(productName: string) {
    super(
      `Carbon footprint already exists for product name "${productName}"`,
      HttpStatus.CONFLICT,
    );
  }
}

class CarbonFootprintUnknownError extends Error {
  constructor(cause: Error) {
    super(`An unknown error occurred while processing the carbon footprint`, {
      cause: cause,
    });
  }
}

@Injectable()
export class CarbonFootprintService {
  constructor(
    @Inject("CarbonFootprintCalculator")
    private readonly calculator: CarbonFootprintCalculator,
    @InjectRepository(CarbonFootprint)
    private readonly carbonFootprintRepository: Repository<CarbonFootprint>,
  ) {}

  async findByName(productName: string): Promise<CarbonFootprint> {
    const carbonFootprint = await this.carbonFootprintRepository.findOneBy({
      productName,
    });

    if (!carbonFootprint) {
      throw new CarbonFootprintNotFound(productName);
    }

    return carbonFootprint;
  }

  private async assertCarbonFootprintDoesNotExist(product: FoodProduct) {
    try {
      await this.findByName(product.name);
    } catch (error) {
      if (error instanceof CarbonFootprintNotFound) {
        return;
      }
      throw new CarbonFootprintUnknownError(error);
    }
    throw new CarbonFootprintAlreadyExist(product.name);
  }

  async create(product: FoodProduct): Promise<CarbonFootprint> {
    await this.assertCarbonFootprintDoesNotExist(product);

    const footprint = await this.calculator.calculate(product);
    return this.carbonFootprintRepository.save(
      new CarbonFootprint({
        productName: product.name,
        weight: footprint.weight,
        unit: footprint.unit,
      }),
    );
  }
}
