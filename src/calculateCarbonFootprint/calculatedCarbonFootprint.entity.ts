import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("calculated_carbon_footprints")
export class CalculatedCarbonFootprint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  recipe: string;

  @Column({
    type: "float",
    nullable: false,
  })
  totalCarbonFootprint: number;

  constructor(
    recipe: string,
    totalCarbonFootprint: number
  ) {
    super();

    this.recipe = recipe;
    this.totalCarbonFootprint = totalCarbonFootprint;
  }
}
