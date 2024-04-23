import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/*
* construdtorでserviceを指定することで controllerがインスタンスされる時に一緒にインスタンス化される
* Nestjs内部のIoC Containerがこれを行なっている
* 生成されたAppServiceのインスタンスはキャッシュされて再利用されるので一つしかインスタンス化されない仕組みになっている（singleton）
*/

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} 

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
