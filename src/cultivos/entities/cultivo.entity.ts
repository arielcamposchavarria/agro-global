import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EstadoCultivo } from './estado-cultivo.enum';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity({ name: 'cultivos' })
export class Cultivo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number; // bigint en DB, manejado como string en TS para seguridad

  @ManyToOne(() => Usuario, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'agricultor_id' })
  agricultor: Usuario;

  @ManyToOne(() => Categoria, (c) => c.cultivos, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  variedad?: string;

  @Column({
    type: 'enum',
    enum: EstadoCultivo,
    default: EstadoCultivo.PENDIENTE,
  })
  estado: EstadoCultivo;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
