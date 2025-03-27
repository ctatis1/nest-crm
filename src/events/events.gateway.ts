import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Compania } from '../entities/compania.entity';
import { Producto } from '../entities/producto.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  afterInit() {
    this.logger.log('Initialized WebSocket Gateway');
  }

  @OnEvent('company.created')
  handleCompanyCreatedEvent(compania: Compania) {
    this.logger.log(`Compañía creada: ${compania.nombre}`);
    this.server.emit('company.created', compania);
  }

  @OnEvent('product.updated')
  handleProductUpdatedEvent(producto: Producto) {
    this.logger.log(`Producto actualizado: ${producto.nombre}`);
    this.server.emit('product.updated', producto);
  }
} 