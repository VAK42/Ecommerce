import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UseGuards } from '@nestjs/common'
import { jwtGuard } from '../guards/jwt.guard'
@WebSocketGateway(8081, { cors: true })
export class ChatGateway {
  @WebSocketServer()
  server!: Server
  @UseGuards(jwtGuard)
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const payload = typeof data === 'string' ? JSON.parse(data) : data
      if (payload.type === 'assist') {
        client.emit('message', { type: 'assist', text: 'Hello From Assistant', echo: payload.text })
      } else {
        client.emit('message', { type: 'echo', text: String(payload) })
      }
    } catch {
      client.emit('message', { type: 'error', text: 'Invalid' })
    }
  }
}