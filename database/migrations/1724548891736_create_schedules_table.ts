import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.date('work_date').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      table.string('full_data').notNullable()
      table.integer('employee_id').unsigned().references('id').inTable('employees')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
