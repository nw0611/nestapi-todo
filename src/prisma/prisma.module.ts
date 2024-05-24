import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService] // @Inejectableをつけたmoduleをexportsで登録して、外部moduleのimportに指定することでserviceが使用可能になる
})
export class PrismaModule {}
