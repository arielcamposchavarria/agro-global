import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
//import { Usuario } from '../../../usuarios/entities/usuario.entity';

@Entity({ name: 'roles' })
@Unique(['nombre'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  nombre: string;

  @OneToMany(() => Usuario, (u) => u.rol)
  usuarios: Usuario[];
}

