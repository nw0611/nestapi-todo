import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// dtoでclass validationの実装に必要なモジュール
import { ValidationPipe } from '@nestjs/common'
// expressから必要なデータ型
import { Request } from 'express';
// jwt tokenはcookieベースなので
import * as cookieParser from 'cookie-parser';
// csrf対策
import * as csurf from 'csurf';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })) // validationPipe: classvalidatorの機能を有効 / whitelist: dtoに含まれないfieldが送られてきた時に省いてくれる
  app.enableCors({
    credentials: true, // jwt tokenをcookieベースなので許可
    origin: ['http://localhost:3000']  // フロントエンドのドメインからのアクセス許可
  })
  app.use(cookieParser()) // cookie解析用ミドルウェアの実行
  app.use(csurf({
    cookie: {
      httpOnly: true, // jsから読み込まれたくないのでtrue
      sameSite: 'none',
      secure: true, // localだからnone 
    },
    value: (req: Request) => { // 認証フローの
      return req.header('csrf-token')
    }
  }))
  await app.listen(process.env.port || 3000);
}
bootstrap();
