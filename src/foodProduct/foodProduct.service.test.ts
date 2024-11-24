import { dataSource, GreenlyDataSource } from '../../config/dataSource';
import { getTestFoodProduct, TEST_CARBON_EMISSION_FACTORS } from '../seed-dev-data';
import { FoodProductService } from './foodProduct.service';
import { FoodProduct } from './foodProduct.entity';
import { CarbonEmissionFactorsService } from '../carbonEmissionFactor/carbonEmissionFactors.service';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonFootprintCalculatorService } from '../carbonFootprintCalculator/carbonFootprintCalculator.service';

const hamPizza = getTestFoodProduct('ham pizza');
const hamSandwich = getTestFoodProduct('ham sandwich');
const vegetarianPizza = getTestFoodProduct('vegetarian pizza');
let foodProductService: FoodProductService;

beforeAll(async () => {
  await dataSource.initialize();
  foodProductService = new FoodProductService(
    dataSource.getRepository(FoodProduct),
    new CarbonEmissionFactorsService(dataSource.getRepository(CarbonEmissionFactor)),
    new CarbonFootprintCalculatorService(),
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource.getRepository(CarbonEmissionFactor).save(TEST_CARBON_EMISSION_FACTORS);
  await dataSource.getRepository(FoodProduct).save(hamPizza);
});

describe('FoodProduct.service', () => {
  it('should save new foodProducts', async () => {
    await foodProductService.save(
      {
        items: [vegetarianPizza],
      },
      false,
    );
    await foodProductService.save(
      {
        items: [hamSandwich],
      },
      true,
    );

    const retrieveVegetarianPizzaFoodProduct = await dataSource
      .getRepository(FoodProduct)
      .findOne({ where: { name: 'vegetarian pizza' } });
    expect(retrieveVegetarianPizzaFoodProduct?.name).toBe('vegetarian pizza');
    expect(retrieveVegetarianPizzaFoodProduct?.carbonFootprint).toBeNull();

    const retrieveHamSandwichFoodProduct = await dataSource
      .getRepository(FoodProduct)
      .findOne({ where: { name: 'ham sandwich' } });
    expect(retrieveHamSandwichFoodProduct?.name).toBe('ham sandwich');
    expect(retrieveHamSandwichFoodProduct?.carbonFootprint).not.toBeNull();
  });
  it('should compute and save all existing carbon footprint', async () => {
    const beforeResult = await dataSource.getRepository(FoodProduct).find();
    for (const item of beforeResult) {
      expect(item.carbonFootprint).toBeNull();
    }

    await foodProductService.computeAndSaveAllCarbonFootprint();

    const afterResult = await dataSource.getRepository(FoodProduct).find();
    for (const item of afterResult) {
      expect(item.carbonFootprint).not.toBeNull();
    }
  });
  it('should retrieve food products', async () => {
    const foodProducts = await foodProductService.findAll();
    expect(foodProducts).toHaveLength(1);
  });
  it('should compute food product carbon footprint', async () => {
    const retrieveHamPizzaFoodProduct = await dataSource.getRepository(FoodProduct).findOne({ where: { name: 'ham pizza' } });
    if (!retrieveHamPizzaFoodProduct) {
      throw new Error('retrieveHamPizzaFoodProduct was not retrieved');
    }
    retrieveHamPizzaFoodProduct.carbonFootprint = await foodProductService.getCarbonFootprintForRecipe(
      retrieveHamPizzaFoodProduct.recipe,
    );
    expect(retrieveHamPizzaFoodProduct!.carbonFootprint).not.toBeNull();
    await retrieveHamPizzaFoodProduct!.save();
  });
  it('should get carbon footprint for recipe', async () => {
    const value = await foodProductService.getCarbonFootprintForRecipe({
      ingredients: [
        { name: 'ham', quantity: 0.1, unit: 'kg' },
        { name: 'cheese', quantity: 0.15, unit: 'kg' },
        { name: 'tomato', quantity: 0.4, unit: 'kg' },
        { name: 'flour', quantity: 0.7, unit: 'kg' },
        { name: 'oliveOil', quantity: 0.3, unit: 'kg' },
      ],
    });
    expect(value).toBe(0.22399999999999998);
  });
  it('should fail to get carbon footprint for recipe due to missing ingredient data', async () => {
    try {
      await foodProductService.getCarbonFootprintForRecipe({
        ingredients: [
          { name: 'ham', quantity: 0.1, unit: 'kg' },
          { name: 'sweet potato', quantity: 0.1, unit: 'kg' },
        ],
      });
      // noinspection ExceptionCaughtLocallyJS
      throw new Error('Should not reach this point');
    } catch (err) {
      expect(err.message).toMatch('Could not find an EmissionFactor with name "sweet potato"');
    }
  });
  it('should fail to get carbon footprint for recipe due to missing emission factor', async () => {
    try {
      await foodProductService.getCarbonFootprintForRecipeWithMap(
        {
          ingredients: [{ name: 'ham', quantity: 0.1, unit: 'kg' }],
        },
        new Map(),
      );
      // noinspection ExceptionCaughtLocallyJS
      throw new Error('Should not reach this point');
    } catch (err) {
      expect(err.message).toMatch('Could not find emission factor with name "ham"');
    }
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
