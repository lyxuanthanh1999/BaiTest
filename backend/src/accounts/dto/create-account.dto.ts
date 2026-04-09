import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AccountRole } from '../entities/account.entity';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(AccountRole)
  @IsOptional()
  role?: AccountRole;
}
