import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Account, AccountRole } from '../accounts/entities/account.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminExists = await this.accountRepo.findOne({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Abcd1234$', salt);

      const admin = this.accountRepo.create({
        username: 'admin',
        passwordHash,
        email: 'admin@baitest.com',
        fullName: 'Administrator',
        role: AccountRole.ADMIN,
      });

      await this.accountRepo.save(admin);
      console.log('✅ Admin account seeded (admin / Abcd1234$)');
    } else {
      console.log('ℹ️  Admin account already exists, skipping seed');
    }
  }
}
