import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { Account } from './accounts/entities/account.entity';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'lyxuanthanh',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'baitest',
      entities: [Account],
      synchronize: true, // Auto-create tables (dev only)
    }),
    TypeOrmModule.forFeature([Account]),
    AuthModule,
    AccountsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
