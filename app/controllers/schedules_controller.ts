import type { HttpContext } from '@adonisjs/core/http'
import ScheduleService from '#services/schedule_service'
import {
  createScheduleValidator,
  filterScheduleValidator,
  updateScheduleValidator,
} from '#validators/schedule'
import DtoSchedule from '#models/DTOs/dto_schedule'
import UnSavedException from '#exceptions/un_saved_exception'
import UnShowedException from '#exceptions/un_showed_exception'
import UnUpdatedException from '#exceptions/un_updated_exception'
import DtoFilterSchedule from '#models/DTOs/dto_filter_schedule'
import moment from 'moment'

export default class SchedulesController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const schedules = await ScheduleService.index()
      return response.ok(schedules)
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
        payload = await createScheduleValidator.validate(data)
      } catch (err) {
        return response.badRequest(err.messages)
      }
      const pload = new DtoSchedule(payload)
      const schedule: DtoSchedule = await ScheduleService.store(pload)

      return response.ok(schedule)
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
      const schedule: DtoSchedule = await ScheduleService.show(params.id)
      return response.ok(schedule)
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
        payload = await updateScheduleValidator.validate(data)
      } catch (err) {
        return response.badRequest(err.messages)
      }
      const pload = new DtoSchedule(payload)
      const schedule: DtoSchedule = await ScheduleService.update(pload)

      return response.ok(schedule)
    } catch (error) {
      if (error instanceof UnUpdatedException)
        return response.status(error.status).send({ message: error.message, code: error.code })

      return response.internalServerError({ message: error.message })
    }
  }

  async reports({ request, response }: HttpContext) {
    const data = request.body()
    try {
      let payload: any = {}
      try {
        payload = await filterScheduleValidator.validate(data)
      } catch (err) {
        return response.badRequest(err.messages)
      }

      const pload = new DtoFilterSchedule(payload)
      const schedules: DtoSchedule[] = await ScheduleService.allSchedulesByEmployeeIdDataRange(
        pload.employeeId,
        moment(pload.startDate).toDate(),
        moment(pload.endDate).toDate()
      )
      return response.ok(schedules)
    } catch (error) {
      if (error instanceof UnShowedException)
        return response.status(error.status).send({ message: error.message, code: error.code })

      return response.internalServerError({ message: error.message })
    }
  }
}
