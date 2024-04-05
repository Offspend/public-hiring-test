import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IngredientsType } from "./event/create-productCarbonFootprint.event";

@Entity("product_carbon_footprints")
export class ProductCarbonFootprint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  ingredients: string;

  @Column({
    type: "float",
    nullable: true,
  })
  score: number | null;

  sanitize() {
    if (this.name === "") {
      throw new Error("Name cannot be empty");
    }

    if (this.isInvalidIngredientFormat()) {
      throw new Error("Ingredients can not be empty");
    }
  }

  constructor(props: {
    name: string;
    ingredients: IngredientsType[];
    score?: number | null;
  }) {
    super();

    this.name = props?.name;
    this.ingredients = JSON.stringify(props?.ingredients);
    this.score = props?.score ?? null;
    this.sanitize();
  }

  public get ingredientsAsJSON() {
    return JSON.parse(this.ingredients);
  }

  private isInvalidIngredientFormat(): boolean {
    return !!(
      this.ingredients === "" ||
      (this.ingredients &&
        (typeof this.ingredientsAsJSON === typeof "string" ||
          this.ingredientsAsJSON === "" ||
          this.ingredientsAsJSON.length === 0 ||
          Object.keys(this.ingredientsAsJSON[0]).length === 0))
    );
  }
}
