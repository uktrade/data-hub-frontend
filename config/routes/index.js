const router = require('express').Router()

const routers = []
const controllers = [
  '../../src/apps/account/router',
  '../../src/apps/auth/router',
  '../../src/apps/contacts/router',
  '../../src/apps/dashboard/router',
  '../../src/apps/search/router',
  '../../src/apps/service-deliveries/router',
  '../../src/apps/support/router',

  '../../src/controllers/api.controller',
  '../../src/controllers/pingdom.controller',
  '../../src/controllers/interaction.controller',
  '../../src/controllers/interaction-edit.controller',
  '../../src/controllers/company-ch.controller',
  '../../src/controllers/company-foreign.controller',
  '../../src/controllers/company-ltd.controller',
  '../../src/controllers/company-ukother.controller',
  '../../src/controllers/company-interaction.controller',
  '../../src/controllers/company-contact.controller',
  '../../src/controllers/company-investments.controller',
  '../../src/controllers/company-export.controller',
  '../../src/controllers/company-add.controller',
  '../../src/controllers/company-archive.controller',
  '../../src/controllers/investment',
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
