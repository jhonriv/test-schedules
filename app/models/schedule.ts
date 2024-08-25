import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'employee_id' })
  declare employeeId: number

  @column({ columnName: 'full_data' })
  declare fullData: string

  @column({ columnName: 'work_date' })
  declare workDate: Date

  @column({ columnName: 'start_time' })
  declare startTime: Date

  @column({ columnName: 'end_time' })
  declare endTime: Date

  @column({ columnName: 'created_at' })
  declare createdAt: Date

  @column({ columnName: 'updated_at' })
  declare updatedAt: Date
}
