import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'collaborator'],
    default: 'collaborator',
  })
  role!: string;

  @Column({ name: 'start_date' })
  startDate!: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate!: Date;

  @Column({ name: 'is_first_login', default: true })
  isFirstLogin!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt!: Date;
}
