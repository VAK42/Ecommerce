import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
@Entity('coupons')
export class couponEntity {
  @PrimaryGeneratedColumn()
  id!: number
  @Column({ unique: true })
  code!: string
  @Column('float')
  discount!: number
  @Column({ default: true })
  active!: boolean
}