import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("carbon_footprint")
export class CarbonFootprint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "float",
    nullable: true,
  })
  weight: number | null;

  @Column({
    nullable: false,
  })
  unit: string;

  @Column({
    nullable: false,
    unique: true,
  })
  productName: string;

  constructor(props: {
    weight: number | null;
    unit: string;
    productName: string;
  }) {
    super();

    this.weight = props?.weight;
    this.unit = props?.unit;
    this.productName = props?.productName;
  }
}
