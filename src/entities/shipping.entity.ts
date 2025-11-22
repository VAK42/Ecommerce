import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
@Entity('shipments')
export class shippingEntity {
  @PrimaryGeneratedColumn()
  id!: number
  @Column()
  orderId!: number
  @Column()
  service!: string
  @Column('int')
  days!: number
  @Column('float')
  price!: number
  @Column({ default: 'created' })
  status!: string
  @CreateDateColumn()
  createdAt!: Date
} 