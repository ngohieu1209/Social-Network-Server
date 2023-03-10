import { action_commentNotFound } from './../comment/utils/comment.constants';
import {
  event_onNewComment,
  event_onEditComment,
  action_newComment,
  action_editComment,
  event_onDeleteComment,
  action_deleteComment,
  event_postNotFound,
  action_postNotFound,
  event_commentNotFound,
} from '../comment/utils/comment.constants';
import {
  action_deleteNotification,
  action_newNotification,
  action_notificationNotFound,
  action_seenNotification,
  event_notificationNotFound,
  event_onDeleteNotification,
  event_onNewNotification,
  event_onSeenNotification,
} from '../notification/utils/notification.constants';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentService } from '../comment/comment.service';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { WebsocketService } from './websocket.service';
import { AuthenticatedWsGuard } from '../auth/guards/authenticated-ws.guard';
import { EditCommentDto } from '../comment/dto/edit-comment.dto';
import { DeleteCommentDto } from '../comment/dto/delete-comment.dto';
import { NotificationService } from '../notification/notification.service';

@UseGuards(AuthenticatedWsGuard)
@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly commentService: CommentService,
    private readonly notificationService: NotificationService,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WebsocketGateway');

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    const clientId = client.id.toString();
    const userId = client.handshake.auth.id;
    if (!userId) {
      return this.disconnect(client);
    }
    this.logger.log(`User connected ${clientId}`);
    this.websocketService.addNewConnectedUser(clientId, userId);
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id.toString();
    this.logger.log(`User disconnected ${clientId}`);
    this.websocketService.removeConnectedUser(clientId);
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage('Comment:NewComment')
  async onNewComment(
    @ConnectedSocket() socket: Socket,
    @MessageBody() createCommentDto: CreateCommentDto,
  ) {
    try {
      const data = await this.commentService.createComment(createCommentDto);
      this.server.emit(event_onNewComment, {
        ACTION: action_newComment,
        PAYLOAD: data.comment,
      });
      this.server.emit(event_onNewNotification, {
        ACTION: action_newNotification,
        PAYLOAD: data.notification,
      });
    } catch (error) {
      socket.emit(event_postNotFound, {
        ACTION: action_postNotFound,
        PAYLOAD: error.message,
      });
    }
  }

  @SubscribeMessage('Comment:EditComment')
  async onEditComment(
    @ConnectedSocket() socket: Socket,
    @MessageBody() editCommentDto: EditCommentDto,
  ) {
    try {
      const data = await this.commentService.editComment(editCommentDto);
      this.server.emit(event_onEditComment, {
        ACTION: action_editComment,
        PAYLOAD: data,
      });
    } catch (error) {
      socket.emit(event_commentNotFound, {
        ACTION: action_commentNotFound,
        PAYLOAD: error.message,
      });
    }
  }

  @SubscribeMessage('Comment:DeleteComment')
  async onDeleteComment(
    @ConnectedSocket() socket: Socket,
    @MessageBody() deleteCommentDto: DeleteCommentDto,
  ) {
    try {
      const data = await this.commentService.deleteComment(deleteCommentDto);
      this.server.emit(event_onDeleteComment, {
        ACTION: action_deleteComment,
        PAYLOAD: data,
      });
    } catch (error) {
      socket.emit(event_commentNotFound, {
        ACTION: action_commentNotFound,
        PAYLOAD: error.message,
      });
    }
  }

  @SubscribeMessage('Notification:SeenNotification')
  async onSeenNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody() id: string,
  ) {
    try {
      const data = await this.notificationService.seenNotification(id);
      this.server.emit(event_onSeenNotification, {
        ACTION: action_seenNotification,
        PAYLOAD: data,
      });
    } catch (error) {
      socket.emit(event_notificationNotFound, {
        ACTION: action_notificationNotFound,
        PAYLOAD: error.message,
      });
    }
  }

  @SubscribeMessage('Notification:DeleteNotification')
  async onDeleteNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody() id: string,
  ) {
    try {
      const data = await this.notificationService.deleteNotification(id);
      this.server.emit(event_onDeleteNotification, {
        ACTION: action_deleteNotification,
        PAYLOAD: data,
      });
    } catch (error) {
      socket.emit(event_notificationNotFound, {
        ACTION: action_notificationNotFound,
        PAYLOAD: error.message,
      });
    }
  }
}
