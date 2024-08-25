import UnSavedException from '#exceptions/un_saved_exception'
import UnShowedException from '#exceptions/un_showed_exception'
import DtoEmployee from '#models/DTOs/dto_employee'
import Employee from '#models/employee'
import moment from 'moment'

export default class EmployeeService {
  static async index(): Promise<DtoEmployee[]> {
    try {
      let dbResponse: Employee[] = await Employee.all()
      const employees: DtoEmployee[] = dbResponse.map((employee) => this.toDtoEmployee(employee))
      return employees
    } catch (error) {
      throw new Error(`Failed to get employees: ${error}`)
    }
  }

  static async store(data: DtoEmployee): Promise<DtoEmployee> {
    try {
      let employee = await Employee.findBy('cardId', data.cardId)
      if (employee)
        throw new UnSavedException('Employee already exists', {
          status: 403,
          code: 'EMPLOYEE_ALREADY_EXISTS',
        })

      let dbEmployee = this.toEmployee(data)
      const today = moment()
      dbEmployee.createdAt = today.toDate()
      dbEmployee.updatedAt = today.toDate()
      employee = await Employee.create(dbEmployee)
      if (!employee)
        throw new UnSavedException('Failed to create employee', {
          status: 500,
          code: 'FAILED_TO_CREATE_EMPLOYEE',
        })

      return this.toDtoEmployee(employee)
    } catch (error) {
      if (error instanceof UnSavedException) throw error

      throw new Error(`Failed to create employee: ${error}`)
    }
  }

  static async show(id: number): Promise<DtoEmployee> {
    try {
      const employee = await Employee.find(id)
      if (!employee)
        throw new UnShowedException('Employee not found', {
          status: 404,
          code: 'EMPLOYEE_NOT_FOUND',
        })

      return this.toDtoEmployee(employee)
    } catch (error) {
      if (error instanceof UnShowedException) throw error

      throw new Error(`Failed to get employees: ${error}`)
    }
  }

  static async update(data: DtoEmployee): Promise<DtoEmployee> {
    try {
      let dbEmployee = await Employee.find(data.id)
      if (!dbEmployee)
        throw new UnSavedException('Employee not found', {
          status: 404,
          code: 'EMPLOYEE_NOT_FOUND',
        })

      let { birthDate, createdAt, updatedAt, ...employee } = data
      const result = await dbEmployee
        .merge({
          ...employee,
          birthDate: moment(birthDate).toDate(),
          updatedAt: moment().toDate(),
        })
        .save()

      return this.toDtoEmployee(result)
    } catch (error) {
      if (error instanceof UnSavedException) throw error

      throw new Error(`Failed to create employee: ${error}`)
    }
  }

  static toEmployee(dto: DtoEmployee): Employee {
    let emp = new Employee()
    emp.fill({
      id: dto.id,
      name: dto.name,
      lastName: dto.lastName,
      cardId: dto.cardId,
      birthDate: moment(dto.birthDate).toDate(),
    })

    if (dto.createdAt) emp.createdAt = moment(dto.createdAt).toDate()
    if (dto.updatedAt) emp.updatedAt = moment(dto.updatedAt).toDate()

    return emp
  }

  static toDtoEmployee(employee: Employee): DtoEmployee {
    return {
      id: employee.id,
      name: employee.name,
      lastName: employee.lastName,
      cardId: employee.cardId,
      birthDate: moment(employee.birthDate).format('YYYY-MM-DD'),
    }
  }
}
