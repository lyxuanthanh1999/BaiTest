import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async findAll(): Promise<Omit<Account, 'passwordHash'>[]> {
    const accounts = await this.accountRepo.find({
      order: { createdAt: 'DESC' },
    });
    return accounts.map(({ passwordHash, ...rest }) => rest);
  }

  async findOne(id: number): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account #${id} not found`);
    }
    return account;
  }

  async findByUsername(username: string): Promise<Account | null> {
    return this.accountRepo.findOne({ where: { username } });
  }

  async create(dto: CreateAccountDto): Promise<Omit<Account, 'passwordHash'>> {
    const existing = await this.findByUsername(dto.username);
    if (existing) {
      throw new ConflictException(`Username "${dto.username}" already exists`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const account = this.accountRepo.create({
      username: dto.username,
      passwordHash,
      email: dto.email,
      fullName: dto.fullName,
      phone: dto.phone,
      role: dto.role,
    });

    const saved = await this.accountRepo.save(account);
    const { passwordHash: _, ...result } = saved;
    return result;
  }

  async update(id: number, dto: UpdateAccountDto): Promise<Omit<Account, 'passwordHash'>> {
    const account = await this.findOne(id);

    if (dto.username && dto.username !== account.username) {
      const existing = await this.findByUsername(dto.username);
      if (existing) {
        throw new ConflictException(`Username "${dto.username}" already exists`);
      }
      account.username = dto.username;
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      account.passwordHash = await bcrypt.hash(dto.password, salt);
    }

    if (dto.email !== undefined) account.email = dto.email;
    if (dto.fullName !== undefined) account.fullName = dto.fullName;
    if (dto.phone !== undefined) account.phone = dto.phone;
    if (dto.role !== undefined) account.role = dto.role;

    const saved = await this.accountRepo.save(account);
    const { passwordHash: _, ...result } = saved;
    return result;
  }

  async remove(id: number): Promise<void> {
    const account = await this.findOne(id);
    await this.accountRepo.remove(account);
  }
}
