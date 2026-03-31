import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}

