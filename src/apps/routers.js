const router = require('express').Router()
const fs = require('fs')

const { setHomeBreadcrumb } = require('./middleware')

const appsRouters = []
const subApps = fs.readdirSync(__dirname)

subApps.forEach(subAppDir => {
  const subApp = require(`./${subAppDir}`)

  if (subApp.mountpath) {
    appsRouters.push(router.use(subApp.mountpath, setHomeBreadcrumb(subApp.displayName), subApp.router))
  } else if (subApp.router) {
    appsRouters.push(router.use(subApp.router))
  } else {
    appsRouters.push((req, res, next) => next())
  }
})

module.exports = appsRouters
