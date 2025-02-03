import { Test, TestingModule } from '@nestjs/testing';
import { CarbonEmissionRecipeService } from './carbon-emission-recipe.service';

describe('CarbonEmissionRecipeService', () => {
  let service: CarbonEmissionRecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarbonEmissionRecipeService],
    }).compile();

    service = module.get<CarbonEmissionRecipeService>(CarbonEmissionRecipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
