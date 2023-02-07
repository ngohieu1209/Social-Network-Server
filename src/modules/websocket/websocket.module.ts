import { CommentModule } from './../comment/comment.module';
import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [CommentModule],
  providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
