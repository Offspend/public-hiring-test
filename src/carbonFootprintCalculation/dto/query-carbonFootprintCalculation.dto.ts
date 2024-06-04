import { IsDefined, IsEmpty, IsString } from 'class-validator';
import { ApiHideProperty } from "@nestjs/swagger";

export class FoodProductNameDto {
    @IsString()
    @IsDefined()
    foodProductName: string;

    @IsEmpty()
    @ApiHideProperty()
    extraParam?: string;
}