import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
@Entity('reviews')
export class reviewEntity {
  @PrimaryGeneratedColumn()
  id!: number
  @Column()
  productId!: number
  @Column()
  userId!: number
  @Column('int')
  rating!: number
  @Column('text')
  comment!: string
  @CreateDateColumn()
  createdAt!: Date
}