import { CarbonFootprintCalculatorService } from './carbonFootprintCalculator.service';

let carbonFootprintCalculatorService: CarbonFootprintCalculatorService;

beforeAll(async () => {
  carbonFootprintCalculatorService = new CarbonFootprintCalculatorService();
});

describe('CarbonFootprintCalculatorService.service', () => {
  it('should compute the carbon footprint', async () => {
    const carbonFootprintValue = carbonFootprintCalculatorService.computeCarbonFootprint('agrybalise', {
      quantity: 3,
      unit: 'kg',
      emissionCO2eInKgPerUnit: 0.12,
    });
    expect(carbonFootprintValue).toBe(0.36);
  });
  it('should throw range error because strategy is not set', async () => {
    expect(() => {
      carbonFootprintCalculatorService.computeCarbonFootprint('', {
        quantity: 3,
        unit: 'g',
        emissionCO2eInKgPerUnit: 0.12,
      });
    }).toThrow('strategy must not be empty');
  });
  it('should throw range error because unit is not handled', async () => {
    expect(() => {
      carbonFootprintCalculatorService.computeCarbonFootprint('agrybalise', {
        quantity: 3,
        unit: 'g',
        emissionCO2eInKgPerUnit: 0.12,
      });
    }).toThrow('Unexpected unit: g');
  });
  it('should throw error because strategy does not exists', async () => {
    expect(() => {
      carbonFootprintCalculatorService.computeCarbonFootprint('a', {
        quantity: 3,
        unit: 'kg',
        emissionCO2eInKgPerUnit: 0.12,
      });
    }).toThrow('CarbonFootprint strategy "a" does not exists');
  });
});
