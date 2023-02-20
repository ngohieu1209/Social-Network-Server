import { CommentModule } from './../comment/comment.module';
import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [CommentModule, NotificationModule],
  providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
