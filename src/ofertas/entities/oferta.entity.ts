import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Cultivo } from '../../cultivos/entities/cultivo.entity';

export enum EstadoOferta {
  BORRADOR = 'borrador',
  PUBLICADO = 'publicado',
  PAUSADO = 'pausado',
  FINALIZADO = 'finalizado'
}

@Entity('ofertas')
export class Oferta {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'seller_id', type: 'bigint' })
  sellerId: number;

  @Column({ name: 'cultivo_id', type: 'int', nullable: true })
  cultivoId: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  unidad: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  precio: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: EstadoOferta,
    default: EstadoOferta.BORRADOR
  })
  estado: EstadoOferta;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto: string;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'seller_id' })
  seller: Usuario;

  @ManyToOne(() => Cultivo, { eager: true })
  @JoinColumn({ name: 'cultivo_id' })
  cultivo: Cultivo;

  // Campos calculados
  get isActive(): boolean {
    return this.estado === EstadoOferta.PUBLICADO;
  }

  get hasStock(): boolean {
    return this.stock > 0;
  }

  get isAvailable(): boolean {
    return this.isActive && this.hasStock;
  }
}