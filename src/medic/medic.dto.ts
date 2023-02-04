import { IsNumber, IsString } from 'class-validator';

export class UpdateNameDto {
  @IsString()
  public readonly name?: string;

  @IsNumber()
  public readonly age?: number;

  @IsString()
  public readonly countryId?: string;

  @IsString()
  public readonly cityId?: string;
}
