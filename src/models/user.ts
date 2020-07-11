import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity()
export class UserEntity extends BaseEntity {
  @Column('varchar', { length: 500, unique: true, nullable: false })
  email: string

  @Column('varchar', { length: 500, nullable: false })
  password: string
}
