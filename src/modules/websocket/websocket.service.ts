import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebsocketService {
  private logger: Logger = new Logger('WebsocketGateWay');
  private connectedUsers = new Map();
  private defaultValue = '';

  addNewConnectedUser = (clientId: string, userId: string) => {
    this.connectedUsers.set(clientId, { userId });
    this.logger.log('new connected users');
    console.log(this.connectedUsers);
  };

  removeConnectedUser = (clientId: string) => {
    if (this.connectedUsers.has(clientId)) {
      this.connectedUsers.delete(clientId);
      this.logger.log('new connected users');
      console.log(this.connectedUsers);
    }
  };
}
