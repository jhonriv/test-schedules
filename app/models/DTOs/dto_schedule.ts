export default class DtoSchedule {
  id: number
  employeeId: number
  workDate: string
  startTime: string
  endTime: string
  createdAt?: string
  updatedAt?: string

  constructor(employee: any) {
    this.id = employee.id
    this.employeeId = employee.employeeId
    this.workDate = employee.workDate
    this.startTime = employee.startTime
    this.endTime = employee.endTime
    this.createdAt = employee?.createdAt
    this.updatedAt = employee?.updatedAt
  }
}
