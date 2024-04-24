import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, Get } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('/csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() };
  }

  @Post('signup')
  // @Body: request bodyの中身を取得するため
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signUp(dto)
  }

  @HttpCode(HttpStatus.OK) // デコレータで200を指定
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response, // cookieの設定とjsonのシリアライズ化の両方の機能をONにするため 参照：https://docs.nestjs.com/controllers#routing （worning）
  ): Promise<Msg> {
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false, // TODO: true: 通信をhttps化する必要がある
      sameSite: 'none',
      path: '/',
    })
    return {
      message: 'ok',
    }
  }

  @HttpCode(HttpStatus.OK) // デコレータで200を指定
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    // 空で設定することでcookieをリセット
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false, // TODO: true: 通信をhttps化する必要がある
      sameSite: 'none',
      path: '/',
    })
    return {
      message: 'ok',
    }
  }
}
