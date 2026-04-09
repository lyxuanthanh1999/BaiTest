import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AccountsService } from '../accounts/accounts.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const account = await this.accountsService.findByUsername(dto.username);
    if (!account) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, account.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      sub: account.id,
      username: account.username,
      role: account.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: account.id,
        username: account.username,
        email: account.email,
        fullName: account.fullName,
        role: account.role,
      },
    };
  }
}
