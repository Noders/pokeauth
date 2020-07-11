import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity()
export class FavoritesEntity extends BaseEntity {
  @Column('varchar', { length: 500, unique: false, nullable: false })
  pokeArray: string
}
