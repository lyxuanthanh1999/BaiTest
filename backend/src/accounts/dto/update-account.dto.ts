import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AccountRole } from '../entities/account.entity';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

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
