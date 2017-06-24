const router = require('express').Router()

const routers = []
const controllers = [
  '../../src/apps/account/router',
  '../../src/apps/api/router',
  '../../src/apps/auth/router',
  '../../src/apps/contacts/router',
  '../../src/apps/dashboard/router',
  '../../src/apps/interactions/router',
  '../../src/apps/investment-projects/router',
  '../../src/apps/pingdom/router',
  '../../src/apps/search/router',
  '../../src/apps/service-deliveries/router',
  '../../src/apps/support/router',
  '../../src/apps/companies/router',
]

controllers.forEach((ctrl) => {
  const appRouter = require(ctrl)

  if (appRouter.hasOwnProperty('path')) {
    routers.push(router.use(appRouter.path, appRouter.router))
  } else {
    routers.push(appRouter.router)
  }
})

module.exports = routers
