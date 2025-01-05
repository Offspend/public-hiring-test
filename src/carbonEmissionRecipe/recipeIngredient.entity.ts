import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionRecipe } from "./carbonEmissionRecipe.entity";

@Entity("recipe_ingredients")
export class RecipeIngredient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CarbonEmissionRecipe, recipe => recipe.ingredients, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "recipe_id" })
    recipe: CarbonEmissionRecipe;

    @ManyToOne(() => CarbonEmissionFactor, {
        nullable: false,
        eager: true
    })
    @JoinColumn({ name: "carbon_emission_factor_id" })
    carbonEmissionFactor: CarbonEmissionFactor;

    @Column("decimal", {
        precision: 10,
        scale: 2,
        nullable: false
    })
    value: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    unit: string;

    sanitize() {
        if (!this.recipe) {
            throw new Error("Recipe is required");
        }
        if (!this.carbonEmissionFactor) {
            throw new Error("CarbonEmissionFactor is required");
        }
        if (this.value < 0) {
            throw new Error("Value cannot be negative");
        }
        if (!this.unit || this.unit.trim() === "") {
            throw new Error("Unit cannot be empty");
        }
    }

    constructor(props?: {
        recipe: CarbonEmissionRecipe;
        carbonEmissionFactor: CarbonEmissionFactor;
        value: number;
        unit: string;
    }) {
        super();
        if (!props) return;

        this.recipe = props.recipe;
        this.carbonEmissionFactor = props.carbonEmissionFactor;
        this.value = props.value;
        this.unit = props.unit;
        this.sanitize();
    }
}