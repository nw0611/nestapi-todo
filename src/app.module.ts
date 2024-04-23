import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // globalで追加しておいて各モジュールで使用する
    AuthModule, UserModule, TodoModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],  // controller内で使いたいserviceをここでも指定する
})
export class AppModule {}
