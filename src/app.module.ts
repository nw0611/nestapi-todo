import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, UserModule, TodoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],  // controller内で使いたいserviceをここでも指定する
})
export class AppModule {}
