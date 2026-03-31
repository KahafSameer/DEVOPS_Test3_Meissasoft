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

        return {
          type: 'postgres' as const,
          url,
          autoLoadEntities: true,
          synchronize: true,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([Todo]),
    TodosModule,
  ],
})
export class AppModule {}

const apiKey = "AKIA1234567890TESTKEY";