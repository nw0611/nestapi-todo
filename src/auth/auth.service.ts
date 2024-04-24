import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Jwt, Msg } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async signUp(dto: AuthDto): Promise<Msg> {
    // UIから受け取ったemail password をhash化する
    const hashed = await bcrypt.hash(dto.password, 12) // 第二引数は桁数
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPasword: hashed,
        }
      });
      return {
        message: 'ok'
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // prisma のエラーコード一覧を参照: https://www.prisma.io/docs/orm/reference/error-reference#error-codes
        // 新規作成の場合は既存のemailかどうか
        if (error.code === 'P2002') {
          throw new ForbiddenException('THis email is already taken')
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto): Promise<Jwt> {
    // emailがdbに存在するか
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    if (!user) throw new ForbiddenException('Email or password incorrect')
    // passwordの検証: bcryptのcompareメソッドに第一引数 UI入力値、第二引数 DBのhash化されたpassword
    const isValid = await bcrypt.compare(dto.password, user.hashedPasword)
    if (!isValid) throw new ForbiddenException('Email or password incorrect')
    return this.generateJwt(user.id, user.email);

  }

  // Authservice jwtを生成するときにpayloadとsecretKeyをjwtアルゴリズムにかけて生成している
  // 逆にtokenとsecretKeyがあればpayloadを復元できる(jwt.strategyで行う)
  async generateJwt(userId: number, email: string): Promise<Jwt> {
    console.log(userId, email)
    const payload = {
      sub: userId,
      email,
    }
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
      secret: secret,
    })
    return {
      accessToken: token,
    }
  }
}


// if (error instanceof Prisma.PrismaClientKnownRequestError) {

// }
