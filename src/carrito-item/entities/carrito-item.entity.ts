import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Carrito } from '../../carrito/entities/carrito.entity';
import { Oferta } from '../../ofertas/entities/oferta.entity';

@Entity('cart_items')
export class CarritoItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'cart_id', type: 'bigint' })
  cartId: number;

  @Column({ name: 'oferta_id', type: 'bigint' })
  ofertaId: number;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  qty: number;

  @Column({ name: 'precio_unit', type: 'decimal', precision: 12, scale: 2 })
  precioUnit: number;

  @Column({ name: 'titulo_snapshot', type: 'varchar', length: 140 })
  tituloSnapshot: string;

  @Column({ name: 'unidad_snapshot', type: 'varchar', length: 20 })
  unidadSnapshot: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Carrito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  carrito: Carrito;

  @ManyToOne(() => Oferta, { eager: true })
  @JoinColumn({ name: 'oferta_id' })
  oferta: Oferta;

  // Campos calculados
  get subtotal(): number {
    return Number(this.qty) * Number(this.precioUnit);
  }

  get isValidStock(): boolean {
    return this.oferta && Number(this.qty) <= Number(this.oferta.stock);
  }
}