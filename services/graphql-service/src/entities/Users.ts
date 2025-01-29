import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { Exchanges } from './Exchanges';
import { History } from './History';
import {
  Field,
  GraphQLISODateTime,
  ObjectType,
  registerEnumType,
} from 'type-graphql';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  COLLABORATOR = 'collaborator',
}

// Enregistrer l'enum pour GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Les différents rôles utilisateur',
});

@ObjectType()
@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users extends BaseEntity {
  @Field(() => String)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String)
  @Column('character varying', { name: 'last_name', length: 50 })
  lastName: string;

  @Field(() => String)
  @Column('character varying', { name: 'first_name', length: 50 })
  firstName: string;

  @Field(() => String)
  @Column('character varying', { name: 'email', unique: true, length: 100 })
  email: string;

  @Column('character varying', { name: 'password', length: 100 })
  password: string;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COLLABORATOR,
  })
  role: UserRole;

  @Field(() => Boolean)
  @Column('boolean', { name: 'is_first_login', default: true })
  isFirstLogin: boolean;

  // @Field(() => String, { nullable: true })
  // @Column('character varying', {
  //   name: 'temporary_password',
  //   nullable: true,
  //   length: 100,
  //   select: false,
  // })
  // temporaryPassword?: string;

  // @Field(() => GraphQLISODateTime, { nullable: true })
  // @Column('timestamp with time zone', {
  //   name: 'temporary_password_expires',
  //   nullable: true,
  // })
  // temporaryPasswordExpires?: Date;

  @Field(() => GraphQLISODateTime)
  @Column('timestamp with time zone', { name: 'start_date' })
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column('timestamp with time zone', { name: 'end_date', nullable: true })
  endDate: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column('timestamp with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Field(() => Exchanges)
  @OneToMany(() => Exchanges, (exchanges) => exchanges.user)
  exchanges: Exchanges[];

  @Field(() => History)
  @OneToMany(() => History, (history) => history.user)
  histories: History[];

  // Méthodes utilitaires
  @Field(() => Boolean)
  isActive(): boolean {
    const now = new Date();
    return (
      now >= this.startDate &&
      (!this.endDate || now <= this.endDate) &&
      !this.deletedAt
    );
  }
}
