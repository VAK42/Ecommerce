import { IsString, IsNumber, Min, IsOptional } from 'class-validator'
export class CreateProductDto {
  @IsString()
  title!: string
  @IsNumber()
  @Min(0)
  price!: number
  @IsNumber()
  @Min(0)
  stock!: number
  @IsString()
  category!: string
  @IsNumber()
  @Min(0)
  rating!: number
  @IsOptional()
  @IsString()
  description?: string
  @IsOptional()
  @IsString()
  sku?: string
  @IsOptional()
  @IsString()
  imageUrl?: string
}