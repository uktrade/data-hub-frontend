const fs = require('fs')
const path = require('path')
const router = require('express').Router()

const config = require('../')
const logger = require('../logger')

const appsPath = path.join(config.root, 'src/apps')
const routers = []

fs.readdirSync(appsPath).forEach((app) => {
  try {
    const appPath = path.join(appsPath, app)
    const appRouter = require(appPath).router

    if (appRouter.hasOwnProperty('path')) {
      routers.push(router.use(appRouter.path, appRouter.router))
    } else {
      routers.push(appRouter.router)
    }
  } catch (e) {
    logger.warn(`Routing: Cannot load '${app}' feature app`)
  }
})

module.exports = routers
