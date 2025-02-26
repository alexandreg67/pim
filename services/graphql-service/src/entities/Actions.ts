import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { History } from './History';
import { Field, ObjectType, registerEnumType } from 'type-graphql';

// Définition de l'enum pour le type d'action
export enum ActionType {
  PRODUCT = 'PRODUCT',
  MEDIA = 'MEDIA',
  CHARACTERISTIC = 'CHARACTERISTIC',
  CATEGORY = 'CATEGORY',
  TAG = 'TAG',
  WORKFLOW = 'WORKFLOW',
}

// Enregistrement de l'enum pour GraphQL
registerEnumType(ActionType, {
  name: 'ActionType',
  description: "Les différents types d'actions possibles dans le PIM",
});

@ObjectType()
@Index('actions_pkey', ['id'], { unique: true })
@Index('actions_name_key', ['name'], { unique: true })
@Index('idx_actions_type', ['type'])
@Entity('actions', { schema: 'public' })
export class Actions extends BaseEntity {
  @Field(() => String)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Field(() => String)
  @Column('character varying', {
    name: 'name',
    unique: true,
    length: 50,
  })
  name: string;

  @Field(() => String, { nullable: true })
  @Column('text', {
    name: 'description',
    nullable: true,
  })
  description: string | null;

  @Field(() => ActionType)
  @Column({
    type: 'enum',
    enum: ActionType,
    name: 'type',
  })
  type: ActionType;

  @Field(() => Boolean)
  @Column('boolean', {
    name: 'active',
    default: true,
  })
  active: boolean;

  @Field(() => [History])
  @OneToMany(() => History, (history) => history.action)
  histories: History[];
}
