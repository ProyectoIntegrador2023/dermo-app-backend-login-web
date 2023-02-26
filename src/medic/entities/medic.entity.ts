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

  @Column({ name: 'pais_id', type: 'varchar', length: 5 })
  public countryId: string | null;

  @Column({ name: 'ciudad_id', type: 'varchar', length: 5 })
  public cityId: string | null;

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
}