const router = require('express').Router()
const fs = require('fs')

const { setHomeBreadcrumb } = require('./middleware')

const subApps = fs.readdirSync(__dirname)

const appsRouters = subApps.map(subAppDir => {
  try {
    const subApp = require(`./${subAppDir}/index.js`)
    if (subApp.mountpath) {
      return router.use(subApp.mountpath, setHomeBreadcrumb(subApp.displayName), subApp.router)
    } else if (subApp.router) {
      return router.use(subApp.router)
    }
  } catch (e) {}

  return (req, res, next) => next()
})

module.exports = appsRouters
