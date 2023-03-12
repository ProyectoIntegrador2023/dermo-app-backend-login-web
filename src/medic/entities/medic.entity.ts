/* eslint-disable @typescript-eslint/no-empty-function */
import { LoginEntity } from '../../auth/entities/login.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('medico')
export class MedicEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'nombre_apellido', type: 'varchar', length: 100 })
  public name: string;

  @Column({ name: 'edad', type: 'int', width: 2 })
  public age: number;

  @Column({ name: 'pais', type: 'varchar', length: 20 })
  public country: string | null;

  @Column({ name: 'ciudad', type: 'varchar', length: 20 })
  public city: string | null;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'fecha_actualizacion',
    type: 'timestamp',
  })
  public updatedAt: Date;

  @Exclude()
  @OneToOne(() => LoginEntity)
  @JoinColumn({ name: 'login_id' })
  public login: LoginEntity;
  // @SONAR_STOP@
  public static of(params: Partial<MedicEntity>): MedicEntity {
    const medicEntity = new MedicEntity();

    Object.assign(medicEntity, params);

    return medicEntity;
  }
}

export class MedicRepositoryFake {
  public create(): void {}
  public async save(): Promise<void> {}
  public async remove(): Promise<void> {}
  public async findOne(): Promise<void> {}
}
// @SONAR_START@
