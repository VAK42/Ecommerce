import { Injectable } from '@nestjs/common'
@Injectable()
export class mockDataProvider {
  products: any[] = []
  users: any[] = []
  orders: any[] = []
  constructor() {
    for (let i = 1; i <= 40; i++) {
      this.products.push({ id: i, title: `Product ${i}`, price: Math.round(Math.random() * 200) + 1, stock: Math.round(Math.random() * 100), category: `Category ${i % 6}`, rating: Math.round(Math.random() * 50) / 10 })
    }
    for (let i = 1; i <= 20; i++) {
      this.users.push({ id: i, name: `User ${i}`, email: `user${i}@example.com`, role: i % 7 === 0 ? 'admin' : 'customer' })
    }
    for (let i = 1; i <= 10; i++) {
      this.orders.push({ id: i, userId: (i % 20) + 1, items: [{ productId: (i % 40) + 1, quantity: 1 + Math.floor(Math.random() * 3) }], total: Math.round(Math.random() * 500) })
    }
  }
}