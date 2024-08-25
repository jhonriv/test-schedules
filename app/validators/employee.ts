import vine from '@vinejs/vine'

export const createEmployeeValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    lastName: vine.string().trim(),
    cardId: vine.string().trim(),
    birthDate: vine.date(),
  })
)

export const updateEmployeeValidator = vine.compile(
  vine.object({
    id: vine.number(),
    name: vine.string().trim().optional(),
    lastName: vine.string().trim().optional(),
    cardId: vine.string().trim().optional(),
    birthDate: vine.date().optional(),
  })
)

export default { createEmployeeValidator, updateEmployeeValidator }
