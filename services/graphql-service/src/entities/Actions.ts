import { Column, Entity, Index, OneToMany } from 'typeorm';
import { History } from './History';
import { Field, ID } from 'type-graphql';

@Index('actions_pkey', ['id'], { unique: true })
@Index('actions_name_key', ['name'], { unique: true })
@Entity('actions', { schema: 'public' })
export class Actions {
  @Field(() => ID)
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name', unique: true, length: 50 })
  name: string;

  @OneToMany(() => History, (history) => history.action)
  histories: History[];
}
