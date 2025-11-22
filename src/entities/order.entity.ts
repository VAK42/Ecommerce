import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
@Entity('orders')
export class orderEntity {
  @PrimaryGeneratedColumn()
  id!: number
  @Column()
  userId!: number
  @Column('simple-json')
  items!: any[]
  @Column('float')
  total!: number
  @Column({ default: 'pending' })
  status!: string
  @CreateDateColumn()
  createdAt!: Date
}