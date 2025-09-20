import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Cultivo } from '../../cultivos/entities/cultivo.entity';

@Entity({ name: 'categorias_cultivo' })
@Unique(['nombre'])
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @OneToMany(() => Cultivo, (c) => c.categoria)
  cultivos: Cultivo[];
}
