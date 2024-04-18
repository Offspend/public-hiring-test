import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { AgrybaliseCarbonFootprintCalculatorService } from "./agrybaliseCarbonFootprintCalculator.service";
import { CarbonFootprint } from "./carbonFootprint.entity";
import {
  CarbonFootprintAlreadyExist,
  CarbonFootprintNotFound,
  CarbonFootprintService,
} from "./carbonFootprint.service";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { FoodProduct } from "./domain/FoodProduct";
import { Ingredient } from "./domain/Ingredient";
import { seedTestCarbonEmissionFactors } from "../seed-dev-data";

let carbonEmissionFactorService: CarbonEmissionFactorsService;
let sut: CarbonFootprintService;

beforeAll(async () => {
  await dataSource.initialize();

  carbonEmissionFactorService = new CarbonEmissionFactorsService(
    dataSource.getRepository(CarbonEmissionFactor),
  );
  sut = new CarbonFootprintService(
    new AgrybaliseCarbonFootprintCalculatorService(carbonEmissionFactorService),
    dataSource.getRepository(CarbonFootprint),
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});

describe("CarbonFootprintService", () => {
  describe("findByName", () => {
    describe("given a carbon footprint for a product", () => {
      const productName = "poulet de bresse";
      let carbonFootprint: CarbonFootprint;

      beforeEach(async () => {
        carbonFootprint = await dataSource.getRepository(CarbonFootprint).save(
          new CarbonFootprint({
            productName,
            weight: 42,
            unit: "kg",
          }),
        );
      });

      it("should return the carbon footprint", async () => {
        const carbonFootprintByName = await sut.findByName(productName);

        expect(carbonFootprintByName).toEqual(carbonFootprint);
      });
    });

    describe("given a non existing carbon footprint", () => {
      it("should throw", async () => {
        await expect(() => {
          return sut.findByName("non-existing-product");
        }).rejects.toThrow(CarbonFootprintNotFound);
      });
    });
  });

  describe("create", () => {
    describe("given a product with ingredients", () => {
      let product: FoodProduct;

      beforeEach(() => {
        product = new FoodProduct("pizza", [
          new Ingredient("ham", 1),
          new Ingredient("cheese", 1),
          new Ingredient("tomato", 2),
          new Ingredient("flour", 3),
          new Ingredient("oliveOil", 0.5),
        ]);
      });

      describe("given each ingredient has a carbon emission factor", () => {
        beforeEach(async () => {
          await seedTestCarbonEmissionFactors();
        });

        it("should create the carbon footprint", async () => {
          const footprint = await sut.create(product);

          expect(footprint).toEqual({
            id: expect.any(Number),
            productName: "pizza",
            weight: 0.985,
            unit: "kg",
          });
        });
      });

      describe("given an ingredient does not have a carbon emission factor", () => {
        it("should create a null carbon footprint", async () => {
          const footprint = await sut.create(product);

          expect(footprint).toEqual({
            id: expect.any(Number),
            productName: "pizza",
            weight: null,
            unit: "kg",
          });
        });
      });

      describe("given a carbon foot print already exists for the product", () => {
        beforeEach(async () => {
          await dataSource.getRepository(CarbonFootprint).save(
            new CarbonFootprint({
              productName: product.name,
              weight: 42,
              unit: "kg",
            }),
          );
        });

        it("should not create the carbon footprint", async () => {
          await expect(() => {
            return sut.create(product);
          }).rejects.toThrow(CarbonFootprintAlreadyExist);
        });
      });
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
