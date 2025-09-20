import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'usuarios' })
@Index('IDX_USUARIOS_EMAIL_UNIQUE', ['email'], { unique: true })
export class Usuario {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number; // bigint -> usa string para no perder precisión en JS

  // FK cruda + relación (permite consultas y validación)
  @Column({ name: 'rol_id', type: 'int' })
  rolId: number;

  @ManyToOne(() => Role, (r) => r.usuarios, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'rol_id' })
  rol: Role;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, nullable: true })
  apellido?: string;

  @Column({ length: 120 })
  email: string;

  // No se selecciona por defecto
  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({ length: 255, nullable: true })
  direccion?: string;

  @Column({ length: 30, nullable: true })
  telefono?: string;

  @Column({ length: 20, default: 'activo' }) // activo/suspendido
  estado: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
