import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Cultivo } from '../../cultivos/entities/cultivo.entity';
import { Lote } from '../../lotes/entities/lote.entity';
import { TipoActividad } from './tipo-actividad.enum';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity({ name: 'actividades' })
export class Actividad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Usuario, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'agricultor_id' })
  agricultor: Usuario;

  @ManyToOne(() => Cultivo, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cultivo_id' })
  cultivo: Cultivo;

  @Column({ type: 'enum', enum: TipoActividad })
  tipo: TipoActividad;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detalle?: string;

  @ManyToOne(() => Lote, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'lote_id' })
  lote: Lote;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cantidad?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unidad?: string;

  @Column({ name: 'fechaInicio', type: 'datetime' })
  fechaInicio: Date;

  @Column({ name: 'fechaFinal', type: 'datetime', nullable: true })
  fechaFinal?: Date;

  @Column({ type: 'text', nullable: true })
  notas?: string;
}
