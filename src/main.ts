import 'reflect-metadata'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { appModule } from './app.module'
async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(appModule, new FastifyAdapter())
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(3000, '0.0.0.0')
}
bootstrap()