import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Actividad } from '../../actividades/entities/actividade.entity';

@Entity({ name: 'lotes' })
export class Lote {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Usuario, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'agricultor_id' })
  agricultor: Usuario;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'area_ha', type: 'decimal', precision: 10, scale: 2, nullable: true })
  areaHa?: string; // TypeORM devuelve decimal como string

  @Column({ type: 'varchar', length: 200, nullable: true })
  ubicacion?: string;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @OneToMany(() => Actividad, (a) => a.lote)
  actividades: Actividad[];
}
