import 'reflect-metadata'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { WebSocketServer, WebSocket } from 'ws'
import { NestFactory } from '@nestjs/core'
import { appModule } from './app.module'
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(appModule, new FastifyAdapter())
  await app.listen(3000, '0.0.0.0')
  const wsServer = new WebSocketServer({ port: 8081 })
  wsServer.on('connection', (socket: WebSocket) => {
    socket.on('message', (msg: unknown) => {
      try {
        const data = JSON.parse(String(msg))
        if (data.type === 'assist') {
          socket.send(JSON.stringify({ type: 'assist', text: 'Hello From Assistant', echo: data.text }))
        } else {
          socket.send(JSON.stringify({ type: 'echo', text: String(msg) }))
        }
      } catch (err) {
        socket.send(JSON.stringify({ type: 'error', text: 'Invalid' }))
      }
    })
  })
}
bootstrap()