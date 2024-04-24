import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { Request } from 'express'
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard('jwt')) // jwtによる認証をかけてuserをプロテクトする
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  //Get
  @Get()
  getLoginuser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    return req.user;
  }

  // jwtストラテジー: auth guardをカスタマイズする処理・cookieやheaderに含まれているかはプロジェクトによって異なるためオプションをつけてカスタマイズする
  @Patch()
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto): Promise<Omit<User, 'hashedPassword'>> {
      return this.UserService.updateUser(req.user.id, dto)
  }

}
