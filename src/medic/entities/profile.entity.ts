import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'nombres', type: 'varchar' })
  public name!: string;

  @Column({ name: 'edad', type: 'varchar' })
  public age!: number;

  @Column({ name: 'pais_cod', type: 'varchar' })
  public countryCode!: string;

  @Column({ name: 'ciudad_cod', type: 'varchar' })
  public cityCode!: string;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
  })
  public createdAt: Date;

  @Column({
    name: 'fecha_actualizacion',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  public lastLoginAt: Date | null;
}
