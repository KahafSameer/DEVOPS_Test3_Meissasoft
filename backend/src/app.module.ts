import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos/todo.entity';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DATABASE_URL;
        if (!url) {
          throw new Error('DATABASE_URL is not set');
        }

        // Many local Postgres setups do not support SSL; only enable SSL when explicitly requested.
        // You can request SSL via DATABASE_SSL=true or by using sslmode=require|verify-ca|verify-full in DATABASE_URL.
        const sslRequested =
          process.env.DATABASE_SSL === 'true' ||
          /sslmode=(require|verify-ca|verify-full)/.test(url);

        return {
          type: 'postgres' as const,
          url,
          autoLoadEntities: true,
          synchronize: true,
          ssl: sslRequested ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    TypeOrmModule.forFeature([Todo]),
    TodosModule,
  ],
})
export class AppModule {}

