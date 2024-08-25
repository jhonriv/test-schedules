/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const EmployeesController = () => import('#controllers/employees_controller')
const SchedulesController = () => import('#controllers/schedules_controller')

router.get('/', async () => {
  return {
    welcome: 'Welcome to test project',
  }
})

router
  .group(() => {
    router.get('/', [EmployeesController, 'index'])
    router.post('/', [EmployeesController, 'store'])
    router.put('/', [EmployeesController, 'update'])
    router.get('/:id', [EmployeesController, 'show'])
  })
  .prefix('/employees')

router
  .group(() => {
    router.get('/', [SchedulesController, 'index'])
    router.post('/', [SchedulesController, 'store'])
    router.put('/', [SchedulesController, 'update'])
    router.get('/:id', [SchedulesController, 'show'])
    router.post('/reports', [SchedulesController, 'reports'])
  })
  .prefix('/schedules')
