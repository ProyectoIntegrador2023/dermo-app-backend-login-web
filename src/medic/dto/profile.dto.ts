import { IsBase64, IsEmail, IsString, MinLength } from 'class-validator';
export class ProfileDto {
  @IsString()
  @MinLength(2)
  specialty: string;

  @IsString()
  @MinLength(2)
  licenceId: string;

  @IsString()
  licenceValidityDate: Date;

  @IsBase64()
  @MinLength(2)
  licenceImage: Buffer;

  @IsEmail()
  public readonly email?: string;
}
