import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { getTestEmissionFactor, getTestFootprintCalculation } from "../src/seed-dev-data";
import { CarbonFootprintCalculation } from "../src/carbonFootprintCalculation/carbonFootprintCalculation.entity";

beforeAll(async () => {
    await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.dropDatabase();
  await dataSource.destroy();
});

describe("CarbonFootprintCalculationController", () => {
  let app: INestApplication;
  let defaultCarbonFootprintCalculations: CarbonFootprintCalculation[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await dataSource
      .getRepository(CarbonEmissionFactor)
      .save([getTestEmissionFactor("cheese"), getTestEmissionFactor("tomato")]);

    await dataSource
      .getRepository(CarbonFootprintCalculation)
      .save([getTestFootprintCalculation("hamCheesePizza")]);

    defaultCarbonFootprintCalculations = await dataSource
      .getRepository(CarbonFootprintCalculation)
      .find();
  });

  it("GET /carbon-footprint-calculation", async () => {
    return request(app.getHttpServer())
      .get("/carbon-footprint-calculation")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(defaultCarbonFootprintCalculations);
      });
  });

  it("GET /carbon-footprint-calculation/:id", async () => {
    return request(app.getHttpServer())
        .get("/carbon-footprint-calculation/" + defaultCarbonFootprintCalculations[0].id)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual(defaultCarbonFootprintCalculations[0]);
        });
  });

  it("GET /carbon-footprint-calculation/filter?foodProductName=hamCheesePizza", async () => {
    return request(app.getHttpServer())
        .get("/carbon-footprint-calculation/filter?foodProductName=hamCheesePizza")
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual(defaultCarbonFootprintCalculations[0]);
        });
  });

  it("POST /carbon-footprint-calculation", async () => {
    const carbonFootprintCalculationBody = {
        foodProductName: "cheesePizzaRevisited",
        ingredients: [
            { name: "tomato", quantity: 0.1, unit: "kg" },
            { name: "cheese", quantity: 0.2, unit: "kg" },
        ],
    };
    return request(app.getHttpServer())
      .post("/carbon-footprint-calculation")
      .send(carbonFootprintCalculationBody)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
            ...carbonFootprintCalculationBody,
            carbonFootprint: 0.037,
        });
      });
  });
});
