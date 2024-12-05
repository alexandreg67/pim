import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { Exchanges } from './Exchanges';
import { History } from './History';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users extends BaseEntity {
  @Field()
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field()
  @Column('character varying', { name: 'last_name', length: 50 })
  lastName: string;

  @Field()
  @Column('character varying', { name: 'first_name', length: 50 })
  firstName: string;

  @Field()
  @Column('character varying', { name: 'email', unique: true, length: 100 })
  email: string;

  @Field()
  @Column('character varying', { name: 'password', length: 100 })
  password: string;

  @Field({ nullable: true })
  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Field({ nullable: true })
  @Column('timestamp with time zone', { name: 'start_date' })
  startDate: Date;

  @Field({ nullable: true })
  @Column('timestamp with time zone', { name: 'end_date', nullable: true })
  endDate: Date | null;

  @Field()
  @Column('boolean', { name: 'is_admin', default: () => 'false' })
  isAdmin: boolean;

  @Field({ nullable: true })
  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Field({ nullable: true })
  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Field({ nullable: true })
  @Column('timestamp with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Exchanges, (exchanges) => exchanges.user)
  exchanges: Exchanges[];

  @OneToMany(() => History, (history) => history.user)
  histories: History[];
}
