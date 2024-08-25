import UnSavedException from '#exceptions/un_saved_exception'
import UnShowedException from '#exceptions/un_showed_exception'
import UnUpdatedException from '#exceptions/un_updated_exception'
import DtoSchedule from '#models/DTOs/dto_schedule'
import Employee from '#models/employee'
import Schedule from '#models/schedule'
import moment from 'moment'

export default class ScheduleService {
  static async index(): Promise<DtoSchedule[]> {
    try {
      let dbResponse: Schedule[] = await Schedule.all()
      const schedules: DtoSchedule[] = dbResponse.map((schedule) => this.toDtoSchedule(schedule))
      return schedules
    } catch (error) {
      throw new Error(`Failed to get schedules: ${error}`)
    }
  }

  static async store(data: DtoSchedule): Promise<DtoSchedule> {
    try {
      let workDate = moment(data.workDate)
      let fullData = this.createFullData(
        workDate,
        moment(data.startTime),
        moment(data.endTime),
        data.employeeId
      )
      let search = await Schedule.findBy({ fullData })
      if (search)
        throw new UnSavedException('Schedule already exists', {
          status: 403,
          code: 'SCHEDULE_ALREADY_EXISTS',
        })

      let dbSchedule = this.toSchedule(data)
      const today = moment()
      dbSchedule.createdAt = today.toDate()
      dbSchedule.updatedAt = today.toDate()
      dbSchedule.fullData = fullData

      const employee = await Employee.find(data.employeeId)
      if (!employee)
        throw new UnSavedException('Employee not found', {
          status: 404,
          code: 'EMPLOYEE_NOT_FOUND',
        })

      const schedule = await employee.related('schedules').create(dbSchedule)
      if (!schedule)
        throw new UnSavedException('Failed to create schedule', {
          status: 500,
          code: 'FAILED_TO_CREATE_SCHEDULE',
        })

      return this.toDtoSchedule(schedule)
    } catch (error) {
      if (error instanceof UnSavedException) throw error

      throw new Error(`Failed to create schedule: ${error}`)
    }
  }

  static async show(id: number): Promise<DtoSchedule> {
    try {
      const schedule = await Schedule.find(id)
      if (!schedule)
        throw new UnShowedException('Schedule not found', {
          status: 404,
          code: 'SCHEDULE_NOT_FOUND',
        })

      return this.toDtoSchedule(schedule)
    } catch (error) {
      if (error instanceof UnShowedException) throw error

      throw new Error(`Failed to get schedules: ${error}`)
    }
  }

  static async allSchedulesByEmployeeIdDataRange(
    employeeId: number,
    startDate: Date,
    endDate: Date
  ): Promise<DtoSchedule[]> {
    try {
      const employee = await Employee.find(employeeId)
      if (!employee)
        throw new UnShowedException('Employee not found', {
          status: 404,
          code: 'EMPLOYEE_NOT_FOUND',
        })

      const schedules = await employee
        .related('schedules')
        .query()
        .whereBetween('workDate', [startDate, endDate])
        .orderBy('workDate', 'asc')

      return schedules.map((schedule) => this.toDtoSchedule(schedule))
    } catch (error) {
      if (error instanceof UnShowedException) throw error

      throw new Error(`Failed to get schedules: ${error}`)
    }
  }

  static async update(data: DtoSchedule): Promise<DtoSchedule> {
    try {
      let dbSchedule = await Schedule.find(data.id)
      if (!dbSchedule)
        throw new UnUpdatedException('Schedule not found', {
          status: 404,
          code: 'SCHEDULE_NOT_FOUND',
        })

      let { workDate, startTime, endTime, createdAt, updatedAt, ...schedule } = data
      let fullData = this.createFullData(
        moment(workDate),
        moment(data.startTime),
        moment(data.endTime),
        data.employeeId
      )
      let search = await Schedule.findBy({ fullData })
      if (search)
        throw new UnUpdatedException('Schedule already duplicated for this employee', {
          status: 403,
          code: 'SCHEDULE_DUPLICATED',
        })
      const employee = await Employee.find(data.employeeId)
      if (!employee)
        throw new UnUpdatedException('Employee not found', {
          status: 404,
          code: 'EMPLOYEE_NOT_FOUND',
        })
      const result = await dbSchedule
        .merge({
          ...schedule,
          workDate: moment(workDate).toDate(),
          startTime: this.convertToTime(moment(workDate), moment(startTime)),
          endTime: this.convertToTime(moment(workDate), moment(endTime)),
          updatedAt: moment().toDate(),
          fullData,
        })
        .save()

      return this.toDtoSchedule(result)
    } catch (error) {
      if (error instanceof UnUpdatedException) throw error

      throw new Error(`Failed to create schedule: ${error}`)
    }
  }

  static toSchedule(dto: DtoSchedule): Schedule {
    let emp = new Schedule()
    let workDate = moment(dto.workDate)

    emp.fill({
      id: dto.id,
      employeeId: dto.employeeId,
      workDate: workDate.toDate(),
      startTime: this.convertToTime(workDate, moment(dto.startTime)),
      endTime: this.convertToTime(workDate, moment(dto.endTime)),
      createdAt: moment(dto.createdAt).toDate(),
    })

    if (dto.createdAt) emp.createdAt = moment(dto.createdAt).toDate()
    if (dto.updatedAt) emp.updatedAt = moment(dto.updatedAt).toDate()

    return emp
  }

  static toDtoSchedule(schedule: Schedule): DtoSchedule {
    return {
      id: schedule.id,
      employeeId: schedule.employeeId,
      workDate: moment(schedule.workDate).format('YYYY-MM-DD'),
      startTime: moment(schedule.startTime).format('HH:mm'),
      endTime: moment(schedule.endTime).format('HH:mm'),
    }
  }

  static convertToTime(workDate: moment.Moment, time: moment.Moment): Date {
    time.set({
      year: workDate.year(),
      month: workDate.month(),
      date: workDate.date(),
    })

    return time.toDate()
  }

  static createFullData(
    workDate: moment.Moment,
    startTime: moment.Moment,
    endTime: moment.Moment,
    employeeId: number
  ) {
    return `${employeeId}-${workDate.format('YYYY-MM-DD')}-${startTime.format('HH:mm:ss')}-${endTime.format('HH:mm:ss')}`
  }
}
