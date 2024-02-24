import {IsNumber, IsString, ValidateNested} from 'class-validator';
import {Type} from "class-transformer";

class CategoryInPostDto {
  @IsNumber()
  public id: number;
}

class CreatePostDto {
  @IsString()
  public content: string;

  @IsString()
  public title: string;

  @ValidateNested()
  @Type(() => CategoryInPostDto)
  public categories: CategoryInPostDto[];
}

export default CreatePostDto;