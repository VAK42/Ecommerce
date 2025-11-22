import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
@Entity('users')
export class userEntity {
  @PrimaryGeneratedColumn()
  id!: number
  @Column({ unique: true })
  email!: string
  @Column()
  name!: string
  @Column()
  password!: string
  @Column({ default: 'customer' })
  role!: string
}