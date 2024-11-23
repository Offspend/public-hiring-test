import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {FoodProduct} from "./foodProduct.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FoodProduct])],
  providers: [],
  controllers: [],
})
export class FoodProductModule {}
