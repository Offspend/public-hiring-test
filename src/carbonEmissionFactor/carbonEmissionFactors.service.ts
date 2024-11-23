import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";

@Injectable()
export class CarbonEmissionFactorsService {
  constructor(
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
  ) {}

  findAll(): Promise<CarbonEmissionFactor[]> {
    return this.carbonEmissionFactorRepository.find();
  }

  findByName(name: string): Promise<CarbonEmissionFactor | null> {
    return this.carbonEmissionFactorRepository.findOne({
      where: {
        name,
      }
    });
  }

  findByNames(names: string[]): Promise<CarbonEmissionFactor[]> {
    return this.carbonEmissionFactorRepository.find({
      where: {
        name: In(names),
      }
    });
  }

  async getEmissionFactorMapByNames(names: string[]): Promise<Map<string, CarbonEmissionFactor>> {
    const emissionFactors = await this.findByNames(names);
    const mapResult = new Map<string, CarbonEmissionFactor>();
    emissionFactors.forEach(emissionFactor => {
      mapResult.set(emissionFactor.name, emissionFactor);
    });
    for (const name of names) {
      if (!mapResult.has(name)) {
        throw new Error(`Could not find an EmissionFactor with name "${name}"`);
      }
    }
    return mapResult;
  }

  save(
    carbonEmissionFactor: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    return this.carbonEmissionFactorRepository.save(carbonEmissionFactor);
  }
}
