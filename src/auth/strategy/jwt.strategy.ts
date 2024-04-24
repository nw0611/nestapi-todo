// NOTE: jwtストラテジー: cookieやheaderに含まれているかはプロジェクトによって異なるためオプションをつけて管理しておく
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // secretKeyとtokenを元にpayloadを復元する
      // 今回はcookieを使用しているので、cookieからtokenを取り出す処理を記述
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null;
          if (req && req.cookies) {
            jwt = req.cookies['access_token'];
          }
          console.log('return jwt:', jwt)
          return jwt;
        }
      ]),
      // 有効期限が切れていても有効とされてしまうのでfalse
      ignoreExpiration: false,
      // jwtを生成するのに使用したsecretKeyを指定（.envから）
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  // 復元したpayloadがvalidateに渡ってくる / subはuserId
  async validate(payload: {sub: number; email: string}) {
    console.log('payload', payload)
    console.log('prisma', this.prisma.user)
    // prisma経由でIDに一致するユーザーを取得
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    });
    console.log('find user', user)
    delete user.hashedPasword;
    console.log('validate user', user)
    return user;
  }
}