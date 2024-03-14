import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CalculatedCarbonFootprint } from "./calculatedCarbonFootprint.entity";
import { CalculatedCarbonFootprintService } from "./calculatedCarbonFootprint.service";


let calculatedCarbonFootprintService: CalculatedCarbonFootprintService;

const recipeName = "Ham Cheese Pizza"
const carbonFootprintValue = 0.109
let ingredients = [
    { name: "ham", quantity: 0.1, unit: "kg"},
    { name: "flour", quantity: 0.7, unit: "kg" },
]  

beforeAll(async () => {
    await dataSource.initialize();
    calculatedCarbonFootprintService = new CalculatedCarbonFootprintService(
      dataSource.getRepository(CalculatedCarbonFootprint), dataSource.getRepository(CarbonEmissionFactor)
    );
  });

  beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
    await dataSource
    .getRepository(CalculatedCarbonFootprint)
    .save({recipe:recipeName, totalCarbonFootprint:carbonFootprintValue});
    await dataSource
    .getRepository(CarbonEmissionFactor)
    .save([{ name: "ham", quantity: 0.1, unit: "kg", emissionCO2eInKgPerUnit: 0.11, source: "Agrybalise"},
           { name: "flour", quantity: 0.7, unit: "kg", emissionCO2eInKgPerUnit:0.14, source: "Agrybalise"}
    ])
  });
  
  describe("CalculatedCarbonFootprint.service", () => {
    it("should calculate carbon footprint", async () => {
       let returnedCalculation =  await calculatedCarbonFootprintService.calculateCarbonFootprint(recipeName,ingredients)
       const expectedValue = 0.109
       const expectedRecipeName = "Ham Cheese Pizza"
       expect(returnedCalculation).toStrictEqual({recipeName:expectedRecipeName,sumOfCarbonFootprint:expectedValue});
    });
    it("should retrieve all calculated carbon footprints", async () => {
      const calculatedCarbonFootprints = await calculatedCarbonFootprintService.findAll();
      expect(calculatedCarbonFootprints).toHaveLength(1);
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });