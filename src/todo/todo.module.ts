import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TodoController } from './todo.controller';

@Module({
  imports: [PrismaModule],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
