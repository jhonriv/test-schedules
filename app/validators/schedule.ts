import vine from '@vinejs/vine'

export const createScheduleValidator = vine.compile(
  vine.object({
    employeeId: vine.number(),
    workDate: vine.date({ formats: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'] }),
    startTime: vine.date({ formats: ['HH:mm:ss', 'HH:mm'] }),
    endTime: vine.date({ formats: ['HH:mm:ss', 'HH:mm'] }),
  })
)

export const updateScheduleValidator = vine.compile(
  vine.object({
    id: vine.number(),
    employeeId: vine.number(),
    workDate: vine.date({ formats: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'] }),
    startTime: vine.date({ formats: ['HH:mm:ss', 'HH:mm'] }),
    endTime: vine.date({ formats: ['HH:mm:ss', 'HH:mm'] }),
  })
)

export const filterScheduleValidator = vine.compile(
  vine.object({
    employeeId: vine.number(),
    startDate: vine.date({ formats: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'] }),
    endDate: vine.date({ formats: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'] }),
  })
)

export default { createScheduleValidator, updateScheduleValidator, filterScheduleValidator }
