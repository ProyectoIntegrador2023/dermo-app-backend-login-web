import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Login extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'correo', type: 'varchar' })
  public email!: string;

  @Exclude()
  @Column({ name: 'clave', type: 'varchar' })
  public password!: string;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
  })
  public createdAt: Date;

  @Column({
    name: 'fecha_ultimo_login',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  public lastLoginAt: Date | null;
}
