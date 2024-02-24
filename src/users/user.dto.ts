import { IsOptional, IsString, ValidateNested } from 'class-validator';
import CreateAddressDto from '../address/address.dto';
import {Type} from "class-transformer";

class CreateUserDto {
  @IsString()
  public fullName: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  public address?: CreateAddressDto;
}

export default CreateUserDto;