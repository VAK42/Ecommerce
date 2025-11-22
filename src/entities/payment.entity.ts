import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
@Entity('payments')
export class paymentEntity {
  @PrimaryGeneratedColumn()
  id!: number
  @Column()
  providerId!: string
  @Column('float')
  amount!: number
  @Column()
  status!: string
  @Column()
  orderId!: number
  @CreateDateColumn()
  createdAt!: Date
}