import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { dataSource } from '../config/dataSource';
import { AppModule } from '../src/app.module';
import { CarbonEmissionFactor } from '../src/carbonEmissionFactor/carbonEmissionFactor.entity';
import { getTestFoodProduct, TEST_CARBON_EMISSION_FACTORS } from '../src/seed-dev-data';
import { FoodProduct } from '../src/foodProduct/foodProduct.entity';

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('FoodProductController', () => {
  let app: INestApplication;
  let defaultFoodProduct: FoodProduct[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await dataSource.getRepository(CarbonEmissionFactor).save(TEST_CARBON_EMISSION_FACTORS);

    await dataSource.getRepository(FoodProduct).save([getTestFoodProduct('vegetarian pizza'), getTestFoodProduct('ham pizza')]);

    defaultFoodProduct = await dataSource.getRepository(FoodProduct).find();
  });

  it('GET /food-product', async () => request(app.getHttpServer())
    .get('/food-products')
    .expect(200)
    .expect(({ body }) => {
      expect(body).toEqual(defaultFoodProduct);
      /// Check last created item (from the dataSource setup)
      expect(body[body.length - 1].carbonFootprint).toBeNull();
    }));

  it('POST /food-products', async () => {
    const args = {
      items: [
        {
          name: 'Test Food Product',
          recipe: {
            ingredients: [
              { name: 'ham', quantity: 0.2, unit: 'kg' },
              { name: 'cheese', quantity: 0.1, unit: 'kg' },
              { name: 'tomato', quantity: 0.1, unit: 'kg' },
              { name: 'flour', quantity: 0.6, unit: 'kg' },
              { name: 'oliveOil', quantity: 0.1, unit: 'kg' },
            ],
          },
        },
      ],
    };
    return request(app.getHttpServer())
      .post('/food-products')
      .send(args)
      .expect(201)
      .expect(({ body }) => {
        expect(body.length).toEqual(1);
        expect(body[0]).toMatchObject({
          name: 'Test Food Product',
          carbonFootprint: 0.14600000000000002,
          recipe: {
            ingredients: [
              { name: 'ham', quantity: 0.2, unit: 'kg' },
              { name: 'cheese', quantity: 0.1, unit: 'kg' },
              { name: 'tomato', quantity: 0.1, unit: 'kg' },
              { name: 'flour', quantity: 0.6, unit: 'kg' },
              { name: 'oliveOil', quantity: 0.1, unit: 'kg' },
            ],
          },
        });
      });
  });

  it('POST /food-products/compute-and-save-all', async () => request(app.getHttpServer())
    .post('/food-products/compute-and-save-all')
    .expect(200)
    .expect(({ body }) => {
      expect(body).not.toBeNull();
    }));

  it('POST /food-products/compute-carbon-footprint', async () => {
    const args = {
      recipe: {
        ingredients: [
          { name: 'ham', quantity: 0.2, unit: 'kg' },
          { name: 'cheese', quantity: 0.1, unit: 'kg' },
          { name: 'tomato', quantity: 0.1, unit: 'kg' },
          { name: 'flour', quantity: 0.6, unit: 'kg' },
          { name: 'oliveOil', quantity: 0.1, unit: 'kg' },
        ],
      },
    };
    return request(app.getHttpServer())
      .post('/food-products/compute-carbon-footprint')
      .send(args)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          carbonFootprint: 0.14600000000000002,
        });
      });
  });
});
