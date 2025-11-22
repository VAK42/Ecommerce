import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { userEntity } from './entities/user.entity'
import { productEntity } from './entities/product.entity'
import * as bcrypt from 'bcryptjs'
const dataSource = new DataSource({
	type: 'sqlite',
	database: './data/sqlite.db',
	entities: ['src/entities/*.ts', 'dist/entities/*.js'],
	synchronize: true,
})
async function run() {
	await dataSource.initialize()
	const userRepo = dataSource.getRepository(userEntity)
	const productRepo = dataSource.getRepository(productEntity)
	const userCount = await userRepo.count()
	if (userCount === 0) {
		const ps = await bcrypt.hash('password', 10)
		await userRepo.save([
			{ email: 'admin@example.com', name: 'Admin User', password: ps, role: 'admin' },
			{ email: 'user@example.com', name: 'Customer User', password: ps, role: 'customer' },
		])
	}
	const existingProducts = await productRepo.count()
	if (existingProducts > 0) {
		console.log('Users Seeded! Products Already Exist!')
		process.exit(0)
	}
	const categories = ['Electronics', 'Books', 'Home', 'Fashion', 'Toys', 'Sports', 'Groceries']
	const adjectives = ['Ultra', 'Mini', 'Pro', 'Eco', 'Smart', 'Fresh', 'Classic', 'Modern']
	const nouns = ['Speaker', 'Lamp', 'Watch', 'Shirt', 'Book', 'Drone', 'Mixer', 'Backpack']
	const batch: Partial<productEntity>[] = []
	const total = Number(process.env.PRODUCTS_COUNT || '500')
	for (let i = 1; i <= total; i++) {
		const title = `${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]} ${i}`
		const price = Math.round((Math.random() * 200 + 5) * 100) / 100
		const stock = Math.floor(Math.random() * 200)
		const category = categories[i % categories.length]
		const rating = Math.round((Math.random() * 5) * 10) / 10
		const description = `${title} Is A High-Quality ${nouns[i % nouns.length]} Designed For ${category} Use. It Features ${adjectives[i % adjectives.length]} Performance And Reliable Build!`
		const sku = `SKU-${String(i).padStart(6, '0')}`
		const imageUrl = `https://picsum.photos/seed/product${i}/600/400`
		const createdAt = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365))
		batch.push({ title, price: Number(price), stock, category, rating, description, sku, imageUrl, createdAt })
		if (batch.length >= 100) {
			await productRepo.save(batch as Partial<productEntity>[])
			batch.length = 0
		}
	}
	if (batch.length > 0) await productRepo.save(batch as Partial<productEntity>[])
	console.log('Seeded Users & Products!')
	process.exit(0)
}
run()