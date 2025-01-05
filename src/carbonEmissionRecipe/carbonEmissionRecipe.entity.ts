import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RecipeIngredient } from "./recipeIngredient.entity";

@Entity("carbon_emission_recipes")
export class CarbonEmissionRecipe extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: "varchar"
    })
    name: string;

    @OneToMany(() => RecipeIngredient, ingredient => ingredient.recipe, {
        cascade: ["insert", "update", "remove"],
        eager: true
    })
    ingredients: RecipeIngredient[];

    @Column("decimal", {
        precision: 10,
        scale: 2,
        nullable: true
    })
    totalCarbonEmission: number | null;

    sanitize() {
        if (this.name === "") {
            throw new Error("Name cannot be empty");
        }
    }

    constructor(props: {
        name: string;
        ingredients: RecipeIngredient[];
        totalCarbonEmission: number | null;
    }) {
        super();
        this.name = props?.name;
        this.ingredients = props?.ingredients;
        this.totalCarbonEmission = props?.totalCarbonEmission;
        this.sanitize();
    }
}