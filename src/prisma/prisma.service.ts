import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    super( // superで参照可能にする
      {
        datasources: {
          db: {
            url: config.get('DATABASE_URL')
          }
        }
      }
    )
    
  }
}
