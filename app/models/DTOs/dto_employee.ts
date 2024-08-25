export default class DtoEmployee {
  id: number
  name: string
  lastName: string
  cardId: string
  birthDate: string
  createdAt?: string
  updatedAt?: string

  constructor(employee: any) {
    this.id = employee.id
    this.name = employee.name
    this.lastName = employee.lastName
    this.cardId = employee.cardId
    this.birthDate = employee.birthDate
    this.createdAt = employee?.createdAt
    this.updatedAt = employee?.updatedAt
  }
}
