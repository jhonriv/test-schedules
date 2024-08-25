import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Schedule from '#models/schedule'

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ columnName: 'last_name' })
  declare lastName: string

  @column({ columnName: 'card_id' })
  declare cardId: string

  @column({ columnName: 'birth_date' })
  declare birthDate: Date

  @column({ columnName: 'created_at' })
  declare createdAt: Date

  @column({ columnName: 'updated_at' })
  declare updatedAt: Date

  @hasMany(() => Schedule)
  declare schedules: HasMany<typeof Schedule>
}
