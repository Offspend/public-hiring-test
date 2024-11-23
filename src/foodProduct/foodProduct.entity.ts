import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("food_products")
export class FoodProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
    type: "float",
  })
  carbonFootprint: number | null;

  @Column({
    nullable: false,
    type: 'json'
  })
  recipe: {
    ingredients: {
      name: string;
      quantity: number;
      unit: string;
    }[]
  };

  sanitize() {
    if (this.name === "") {
      throw new Error("Name cannot be empty");
    }
  }

  constructor(props: {
    name: string;
    carbonFootprint: number | null;
    recipe: {
      ingredients: {
        name: string;
        quantity: number;
        unit: string;
      }[]
    },
  }) {
    super();

    this.name = props?.name;
    this.recipe = props?.recipe;
    this.carbonFootprint = props?.carbonFootprint;
    this.sanitize();
  }
}
