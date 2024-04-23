import { Injectable } from '@nestjs/common';

@Injectable() // 他のサービスに注するために指定
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
