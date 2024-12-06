import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { History } from './History';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Index('actions_pkey', ['id'], { unique: true })
@Index('actions_name_key', ['name'], { unique: true })
@Entity('actions', { schema: 'public' })
export class Actions extends BaseEntity {
  @Field(() => ID)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String)
  @Column('character varying', { name: 'name', unique: true, length: 50 })
  name: string;

  @Field(() => History, { nullable: true })
  @OneToMany(() => History, (history) => history.action)
  histories: History[];
}
