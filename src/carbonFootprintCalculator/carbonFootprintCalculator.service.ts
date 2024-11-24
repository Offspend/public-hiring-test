import { Injectable } from '@nestjs/common';

import { CarbonFootprintComputable } from './CarbonFootprintComputable';

type CarbonFootprintCalculateFn = (item: CarbonFootprintComputable) => number;

@Injectable()
export class CarbonFootprintCalculatorService {
  private readonly strategyMap = new Map<string, CarbonFootprintCalculateFn>();

  constructor() {
    const strategyMap = new Map<string, CarbonFootprintCalculateFn>();
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

  computeCarbonFootprint(strategy: string, item: CarbonFootprintComputable): number {
    if (!strategy.length) {
      throw new Error('strategy must not be empty');
    }
    const computeMethod = this.strategyMap.get(strategy.toLocaleLowerCase());
    if (!computeMethod) {
      throw new RangeError(`CarbonFootprint strategy "${strategy}" does not exists`);
    }
    return computeMethod!(item);
  }
}
