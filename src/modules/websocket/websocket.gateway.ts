import {
  event_onNewComment,
  action_newComment,
} from './../comment/utils/constants';
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
    const data = await this.commentService.createComment(createCommentDto);
    this.server.emit(event_onNewComment, {
      ACTION: action_newComment,
      PAYLOAD: data,
    });
  }
}
