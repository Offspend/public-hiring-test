import { Injectable } from "@nestjs/common";
import {CarbonFootprintComputable} from "./CarbonFootprintComputable";

type CarbonFootprintCalculationStrategy = 'agrybalise';

@Injectable()
export class CarbonFootprintCalculatorService {

  private readonly strategyMap = new Map<CarbonFootprintCalculationStrategy, (item: CarbonFootprintComputable) => number>;

  constructor(
  ) {
    const strategyMap = new Map<CarbonFootprintCalculationStrategy, (item: CarbonFootprintComputable) => number>();
    strategyMap.set('agrybalise', this.computeAgrybaliseCarbonFootprint);
    this.strategyMap = strategyMap;
  }

  computeAgrybaliseCarbonFootprint(item: CarbonFootprintComputable): number {
    switch (item.unit) {
      case 'kg':
        return item.emissionCO2eInKgPerUnit * item.quantity;
      default:
        throw new RangeError(`Unexpected unit: ${item.unit}`);
    }
  }

  computeCarbonFootprint(
          strategy: CarbonFootprintCalculationStrategy,
          item: CarbonFootprintComputable,
  ): number {
    const computeMethod = this.strategyMap.get(strategy);
    if (!computeMethod) {
      throw new RangeError(`CarbonFootprint strategy "${strategy}" does not exists`);
    }
    return computeMethod!(item);
  }
}
