import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

interface CreateTodoDto {
  title: string;
  description?: string | null;
}

interface UpdateTodoDto {
  title?: string;
  description?: string | null;
  isCompleted?: boolean;
}

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todoRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  async create(data: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepo.create({
      title: data.title,
      description: data.description ?? null,
    });
    return this.todoRepo.save(todo);
  }

  async update(id: number, data: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, data);
    return this.todoRepo.save(todo);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todoRepo.remove(todo);
  }
}

