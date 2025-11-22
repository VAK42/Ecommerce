import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
@Entity('products')
export class productEntity {
	@PrimaryGeneratedColumn()
	id!: number
	@Column()
	title!: string
	@Column('float')
	price!: number
	@Column()
	stock!: number
	@Column()
	category!: string
	@Column('float')
	rating!: number
	@Column('text', { nullable: true })
	description?: string
	@Column({ nullable: true })
	sku?: string
	@Column({ nullable: true })
	imageUrl?: string
	@CreateDateColumn({ type: 'datetime' })
	createdAt!: Date
	@UpdateDateColumn({ type: 'datetime' })
	updatedAt!: Date
}