/* eslint-disable @typescript-eslint/no-empty-function */
import { Exclude } from 'class-transformer';
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
import { MedicEntity } from './medic.entity';

@Entity('perfil')
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'especialidad', type: 'varchar' })
  public specialty!: string;

  @Column({ name: 'licencia', type: 'varchar' })
  public licenceId!: string;

  @Column({ name: 'fecha_vigencia_licencia', type: 'varchar' })
  public licenceValidityDate!: Date;

  @Column({ name: 'licenciaImg', type: 'varchar', nullable: true })
  public licenceImage!: string;

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
  @OneToOne(() => MedicEntity)
  @JoinColumn({ name: 'medic_id' })
  public medic: MedicEntity;
  // @SONAR_STOP@
  public static of(params: Partial<ProfileEntity>): ProfileEntity {
    const profileEntity = new ProfileEntity();

    Object.assign(profileEntity, params);

    return profileEntity;
  }
}
export class ProfileRepositoryFake {
  public create(): void {}
  public async save(): Promise<void> {}
  public async remove(): Promise<void> {}
  public async findOne(): Promise<void> {}
}
// @SONAR_START@
