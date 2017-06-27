const router = require('express').Router()
const fs = require('fs')
const logger = require('../../config/logger')

const appsRouters = []
const subApps = fs.readdirSync(__dirname)

subApps.forEach(subAppDir => {
  try {
    const subApp = require(`./${subAppDir}`)

    if (subApp.mountpath) {
      appsRouters.push(router.use(subApp.mountpath, subApp.router))
    } else if (subApp.router) {
      appsRouters.push(router.use(subApp.router))
    } else {
      appsRouters.push((req, res, next) => next())
    }
  } catch (err) {
    logger.warn(err.message)
  }
})

module.exports = appsRouters
