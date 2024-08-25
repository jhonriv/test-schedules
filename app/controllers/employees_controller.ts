import UnSavedException from '#exceptions/un_saved_exception'
import UnShowedException from '#exceptions/un_showed_exception'
import DtoEmployee from '#models/DTOs/dto_employee'
import EmployeeService from '#services/employee_service'
import { createEmployeeValidator, updateEmployeeValidator } from '#validators/employee'
import type { HttpContext } from '@adonisjs/core/http'

export default class EmployeesController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const employees = await EmployeeService.index()
      return response.ok(employees)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.body()
    try {
      let payload: any = {}
      try {
        payload = await createEmployeeValidator.validate(data)
      } catch (err) {
        return response.badRequest(err.messages)
      }
      const pload = new DtoEmployee(payload)
      const employee: DtoEmployee = await EmployeeService.store(pload)

      return response.ok(employee)
    } catch (error) {
      if (error instanceof UnSavedException)
        return response.status(error.status).send({ message: error.message, code: error.code })

      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const employee: DtoEmployee = await EmployeeService.show(params.id)
      return response.ok(employee)
    } catch (error) {
      if (error instanceof UnShowedException)
        return response.status(error.status).send({ message: error.message, code: error.code })

      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const data = request.body()
    try {
      let payload: any = {}
      try {
        payload = await updateEmployeeValidator.validate(data)
      } catch (err) {
        return response.badRequest(err.messages)
      }
      const pload = new DtoEmployee(payload)
      const employee: DtoEmployee = await EmployeeService.update(pload)

      return response.ok(employee)
    } catch (error) {
      if (error instanceof UnSavedException)
        return response.status(error.status).send({ message: error.message, code: error.code })

      return response.internalServerError({ message: error.message })
    }
  }
}
