import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TodoService]
})
export class TodoModule {}
