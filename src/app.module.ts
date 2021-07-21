import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.stage.dev'],
    }),
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          host: configService.get('HOST_DB'),
          port: configService.get('PORT_DB'),
          username: configService.get('USERNAME_DB'),
          password: configService.get('PASSWORD_DB'),
          database: configService.get('DATABASE_DB'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    BooksModule,
    AuthorsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
