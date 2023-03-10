import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('login')
export class LoginEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'correo', type: 'varchar', unique: true })
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

  public static of(params: Partial<LoginEntity>): LoginEntity {
    const loginEntity = new LoginEntity();

    Object.assign(loginEntity, params);

    return loginEntity;
  }
}

export class LoginRepositoryFake {
  public create(): void {}
  public async save(): Promise<void> {}
  public async update(): Promise<void> {}
  public async remove(): Promise<void> {}
  public async findOne(): Promise<void> {}
}
