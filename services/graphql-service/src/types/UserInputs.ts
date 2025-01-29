import { Field, InputType } from 'type-graphql';
import { IsDate, IsOptional, Length } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @Length(2, 50)
  firstName: string;

  @Field(() => String)
  @Length(2, 50)
  lastName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(5, 20)
  phone?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field(() => Date)
  startDate: Date;
}
