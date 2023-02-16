import { Login } from '../auth/login.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('medico')
export class Medic extends BaseEntity {
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

  @OneToOne(() => Login)
  @JoinColumn({ name: 'login_id' })
  loginId: Login;
}
