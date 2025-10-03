import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('locales')
export class Locale {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 120, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'integer', nullable: true })
  telefono: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  localidad: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 100, default: 'activo' })
  estado: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  logo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


