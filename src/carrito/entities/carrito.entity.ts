
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CarritoItem } from '../../carrito-item/entities/carrito-item.entity';

export enum EstadoCarrito {
  OPEN = 'open',
  LOCKED = 'locked',
  CHECKED_OUT = 'checked_out',
  ABANDONED = 'abandoned'
}

@Entity('carts')
export class Carrito {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({
    type: 'enum',
    enum: EstadoCarrito,
    default: EstadoCarrito.OPEN
  })
  estado: EstadoCarrito;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: Usuario;

  @OneToMany(() => CarritoItem, (item) => item.carrito, { 
    cascade: true, 
    eager: false // Cambiar a true si quieres que siempre cargue los items automáticamente
  })
  items: CarritoItem[];

  // Campos calculados de estado
  get isActive(): boolean {
    return this.estado === EstadoCarrito.OPEN;
  }

  get isLocked(): boolean {
    return this.estado === EstadoCarrito.LOCKED;
  }

  get isFinalized(): boolean {
    return this.estado === EstadoCarrito.CHECKED_OUT;
  }

  get isAbandoned(): boolean {
    return this.estado === EstadoCarrito.ABANDONED;
  }

  // Campos calculados de items
  get totalItems(): number {
    return this.items?.reduce((total, item) => total + Number(item.qty), 0) || 0;
  }

  get total(): number {
    return this.items?.reduce((total, item) => total + (Number(item.qty) * Number(item.precioUnit)), 0) || 0;
  }

  get isEmpty(): boolean {
    return !this.items || this.items.length === 0;
  }

  get uniqueProducts(): number {
    return this.items?.length || 0;
  }

  // Método helper para obtener resumen del carrito
  get summary(): {
    totalItems: number;
    uniqueProducts: number;
    total: number;
    isEmpty: boolean;
    isActive: boolean;
  } {
    return {
      totalItems: this.totalItems,
      uniqueProducts: this.uniqueProducts,
      total: this.total,
      isEmpty: this.isEmpty,
      isActive: this.isActive,
    };
  }
}