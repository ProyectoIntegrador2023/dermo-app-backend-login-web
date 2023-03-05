import { IsEmail, IsString, MinLength } from 'class-validator';
export class ProfileDto {
  @IsString()
  @MinLength(2)
  specialty: string;

  @IsString()
  @MinLength(2)
  licenceId: string;

  @IsString()
  licenceValidityDate: Date;

  @IsString()
  licenceImage: string;

  @IsEmail()
  public readonly email?: string;
}
