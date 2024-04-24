import { IsOptional, IsString } from "class-validator";

// DataTransferObject クライアントから送られてくるdata
// user更新エンドポイントにclientからtrasferされてくるobjをdtoとして定義
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickName?: string;
}