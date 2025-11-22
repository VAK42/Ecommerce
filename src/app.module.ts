import { recommendationsController } from './controllers/recommendationsController'
import { notificationsController } from './controllers/notificationsController'
import { inventoryController } from './controllers/inventoryController'
import { analyticsController } from './controllers/analyticsController'
import { productsController } from './controllers/productsController'
import { shippingController } from './controllers/shippingController'
import { paymentsController } from './controllers/paymentsController'
import { notificationEntity } from './entities/notification.entity'
import { reviewsController } from './controllers/reviewsController'
import { couponsController } from './controllers/couponsController'
import { searchController } from './controllers/searchController'
import { ordersController } from './controllers/ordersController'
import { adminController } from './controllers/adminController'
import { usersController } from './controllers/usersController'
import { cartController } from './controllers/cartController'
import { authController } from './controllers/authController'
import { shippingEntity } from './entities/shipping.entity'
import { productResolver } from './graphql/productResolver'
import { productEntity } from './entities/product.entity'
import { paymentEntity } from './entities/payment.entity'
import { couponEntity } from './entities/coupon.entity'
import { reviewEntity } from './entities/review.entity'
import { ChatGateway } from './gateways/chatGateway'
import { usersService } from './services/users.service'
import { orderResolver } from './graphql/orderResolver'
import { orderEntity } from './entities/order.entity'
import { userResolver } from './graphql/userResolver'
import { authService } from './services/auth.service'
import { userEntity } from './entities/user.entity'
import { adminGuard } from './guards/admin.guard'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApolloDriver } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { jwtGuard } from './guards/jwt.guard'
import { Module } from '@nestjs/common'
import 'reflect-metadata'
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: './data/sqlite.db',
			entities: [
				userEntity,
				productEntity,
				orderEntity,
				couponEntity,
				reviewEntity,
				notificationEntity,
				shippingEntity,
				paymentEntity,
			],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([
			userEntity,
			productEntity,
			orderEntity,
			couponEntity,
			reviewEntity,
			notificationEntity,
			shippingEntity,
			paymentEntity,
		]),
		GraphQLModule.forRoot({ driver: ApolloDriver, autoSchemaFile: true, playground: true }),
	],
	controllers: [
		productsController,
		usersController,
		ordersController,
		adminController,
		analyticsController,
		cartController,
		couponsController,
		searchController,
		recommendationsController,
		inventoryController,
		reviewsController,
		shippingController,
		paymentsController,
		notificationsController,
		authController,
	],
	providers: [
		usersService,
		authService,
		jwtGuard,
		adminGuard,
		productResolver,
		userResolver,
		orderResolver,
		ChatGateway,
	],
})
export class appModule {}