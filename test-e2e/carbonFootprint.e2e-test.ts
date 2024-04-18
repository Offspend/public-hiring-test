import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { GreenlyDataSource, dataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { CarbonFootprint } from "../src/carbonFootprint/carbonFootprint.entity";
import { seedTestCarbonEmissionFactors } from "../src/seed-dev-data";
import { FoodProduct } from "../src/carbonFootprint/domain/FoodProduct";
import { Ingredient } from "../src/carbonFootprint/domain/Ingredient";

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("CarbonFootprintController", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await GreenlyDataSource.cleanDatabase();
  });

  describe("GET /carbon-footprint/{productName}", () => {
    describe("given a carbon footprint for the raclette", () => {
      const productName = "raclette";
      let carbonFootprint: CarbonFootprint;

      beforeEach(async () => {
        await dataSource
          .getRepository(CarbonFootprint)
          .save(new CarbonFootprint({ productName, weight: 12, unit: "kg" }));

        carbonFootprint = (await dataSource
          .getRepository(CarbonFootprint)
          .findOne({ where: { productName } })) as CarbonFootprint;
      });

      it("should return the carbon footprint", () => {
        return request(app.getHttpServer())
          .get(`/carbon-footprint/${productName}`)
          .expect(200)
          .expect(({ body }) => {
            expect(body).toEqual(carbonFootprint);
          });
      });
    });

    describe("given a non existing carbon footprint", () => {
      it("should return a 404 response", () => {
        return request(app.getHttpServer())
          .get(`/carbon-footprint/non-existing-product`)
          .expect(404);
      });
    });
  });

  describe("POST /carbon-footprint", () => {
    describe("given a product with ingredients having a carbon factor", () => {
      let product = new FoodProduct("pizza", [
        new Ingredient("ham", 1),
        new Ingredient("cheese", 1),
        new Ingredient("tomato", 2),
        new Ingredient("flour", 3),
        new Ingredient("oliveOil", 0.5),
      ]);

      beforeEach(async () => {
        await seedTestCarbonEmissionFactors();
      });

      it("should create a carbon footprint", async () => {
        await request(app.getHttpServer())
          .post("/carbon-footprint")
          .send(product)
          .expect(201)
          .expect(({ body }) => {
            expect(body).toEqual({
              id: expect.any(Number),
              productName: product.name,
              weight: 0.985,
              unit: "kg",
            });
          })
          .then(async ({ body }) => {
            const carbonFootprintInDb = await dataSource
              .getRepository(CarbonFootprint)
              .findOne({ where: { id: body.id } });

            expect(carbonFootprintInDb).toEqual(body);
          });
      });
    });

    describe("given an existing carbon footprint for the food product", () => {
      let product = new FoodProduct("tartiflette", [
        new Ingredient("reblochon", 1),
        new Ingredient("potato", 2),
      ]);

      beforeEach(async () => {
        await dataSource.getRepository(CarbonFootprint).save(
          new CarbonFootprint({
            productName: product.name,
            weight: 12,
            unit: "kg",
          }),
        );
      });

      it("should return a 409 response", async () => {
        await request(app.getHttpServer())
          .post("/carbon-footprint")
          .send(product)
          .expect(409);
      });
    });

    describe("given a food product having an ingredient without carbon emission factor", () => {
      let product = new FoodProduct("orange juice", [
        new Ingredient("orange", 1),
      ]);

      it("should create a null carbon footprint", async () => {
        await request(app.getHttpServer())
          .post("/carbon-footprint")
          .send(product)
          .expect(201)
          .expect(({ body }) => {
            expect(body).toEqual({
              id: expect.any(Number),
              productName: product.name,
              weight: null,
              unit: "kg",
            });
          })
          .then(async ({ body }) => {
            const carbonFootprintInDb = await dataSource
              .getRepository(CarbonFootprint)
              .findOne({ where: { id: body.id } });

            expect(carbonFootprintInDb).toEqual(body);
          });
      });
    });
  });
});
