import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";
import { CarbonFootprintCalculatorIngredient } from "../carbonFootprintCalculator/domain/carbonFootprintCalculator.model";

@Entity("carbon_footprint_calculation")
export class CarbonFootprintCalculation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  foodProductName: string;

  @Column({
    type: 'jsonb',
    nullable: false,
  })
  ingredients: CarbonFootprintCalculatorIngredient[];

  @Column({
    type: "float",
    nullable: true,
  })
  carbonFootprint: number | null;

  sanitize() {
    if (this.foodProductName === "") {
      throw new Error("Food product name cannot be empty");
    }
  }

  constructor(props: {
    foodProductName: string;
    ingredients: CarbonFootprintCalculatorIngredient[];
    carbonFootprint: number;
  }) {
    super();

    this.foodProductName = props?.foodProductName;
    this.ingredients = props?.ingredients;
    this.carbonFootprint = props?.carbonFootprint;
    this.sanitize();
  }
}
