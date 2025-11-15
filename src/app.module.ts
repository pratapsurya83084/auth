
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity'; // <- add your entity here
// import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    // RouterModule.register([
    //   {
    //     path: 'api/v1/auth', // 👈 Base route for AuthModule
    //     module: AuthModule,
    //   },
    // ]),
    ConfigModule.forRoot({ isGlobal: true }), // <<-- makes ConfigService available globally
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        entities: [User],        // add your entities here
        synchronize: true,
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'pratap123',
        database: 'nest-auth',
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
