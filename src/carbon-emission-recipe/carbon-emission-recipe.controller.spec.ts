import { Test, TestingModule } from '@nestjs/testing';
import { CarbonEmissionRecipeController } from './carbon-emission-recipe.controller';

describe('CarbonEmissionRecipeController', () => {
  let controller: CarbonEmissionRecipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarbonEmissionRecipeController],
    }).compile();

    controller = module.get<CarbonEmissionRecipeController>(CarbonEmissionRecipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
