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
  @MaxLength(20)
  public readonly country?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  public readonly city?: string;

  @IsEmail()
  public readonly email?: string;
}
