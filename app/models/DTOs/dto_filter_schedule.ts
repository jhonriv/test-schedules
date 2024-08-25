export default class DtoFilterSchedule {
  employeeId: number
  startDate: string
  endDate: string

  constructor(employee: any) {
    this.employeeId = employee.employeeId
    this.startDate = employee.startDate
    this.endDate = employee.endDate
  }
}
