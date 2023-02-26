import {
  IsEmail,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class MedicDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  public readonly name?: string;

  @IsNumber()
  @Min(18)
  @Max(99)
  public readonly age?: number;

  @IsString()
  @MinLength(2)
  @MaxLength(5)
  public readonly countryId?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(5)
  public readonly cityId?: string;

  @IsEmail()
  public readonly email?: string;
}
