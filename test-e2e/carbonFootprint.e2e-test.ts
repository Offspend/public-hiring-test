import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { GreenlyDataSource, dataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { CarbonFootprint } from "../src/carbonFootprint/carbonFootprint.entity";

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
});
