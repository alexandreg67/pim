import { Field, InputType } from 'type-graphql';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

@InputType()
export class UpdateProductDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 5000)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  shortDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  price?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  label?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}

@InputType()
export class CreateProductDTO {
  @Field()
  @IsString()
  @Length(1, 255)
  name!: string;

  @Field()
  @IsString()
  @Length(1, 255)
  reference!: string;

  @Field()
  @IsString()
  price!: string;

  @Field()
  @IsUUID()
  brandId!: string;

  @Field()
  @IsUUID()
  contactId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 5000)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  shortDescription?: string;

  @Field(() => String, { defaultValue: 'draft' })
  @IsIn(['draft', 'published', 'archived'])
  status: string = 'draft';

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  label?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}

@InputType()
export class AddProductImageDTO {
  @Field()
  @IsUUID()
  productId!: string;

  @Field()
  @IsString()
  @Length(1, 2048)
  url!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  altText?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  isPrimary: boolean = false;
}
