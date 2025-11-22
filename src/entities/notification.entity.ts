import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
@Entity('notifications')
export class notificationEntity {
  @PrimaryGeneratedColumn()
  id!: number
  @Column()
  title!: string
  @Column('text')
  body!: string
  @Column()
  userId!: number
  @Column({ default: false })
  read!: boolean
  @CreateDateColumn()
  createdAt!: Date
}