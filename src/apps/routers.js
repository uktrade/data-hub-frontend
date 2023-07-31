const router = require('express').Router()
const fs = require('fs')

const { setHomeBreadcrumb } = require('./middleware')

const subApps = fs.readdirSync(__dirname, { withFileTypes: true })

const appsRouters = []

const reactRoutes = [
  '/companies',
  '/contacts',
  '/events',
  '/interactions',
  '/omis',
  '/access-denied',
  '/reminders',
  '/reminders/investments-estimated-land-dates',
  '/reminders/investments-no-recent-interactions',
  '/reminders/investments-outstanding-propositions',
  '/reminders/companies-no-recent-interactions',
  '/reminders/companies-new-interactions',
  '/reminders/settings',
  '/reminders/settings/investments-estimated-land-dates',
  '/reminders/settings/investments-no-recent-interactions',
  '/reminders/settings/companies-no-recent-interactions',
  '/reminders/settings/companies-new-interactions',
  '/export/create',
  '/export/:exportId/edit',
  '/export/:exportId/details',
  '/export/:exportId/delete',
  '/companies/:companyId/dnb-hierarchy',
  '/companies/:companyId/company-tree',
  '/companies/:companyId/account-management',
  '/companies/:companyId/account-management/strategy/create',
]

reactRoutes.forEach((path) => {
  router.get(path, async (req, res, next) => {
    try {
      res.render('react')
    } catch (error) {
      next(error)
    }
  })
})

subApps.forEach((subAppDir) => {
  if (subAppDir.isDirectory() && !subAppDir.name.startsWith('__')) {
    const subApp = require(`./${subAppDir.name}`)
    if (subApp.mountpath) {
      appsRouters.push(
        router.use(
          subApp.mountpath,
          setHomeBreadcrumb(subApp.displayName),
          subApp.router
        )
      )
    } else if (subApp.router) {
      appsRouters.push(router.use(subApp.router))
    }
  }
})

module.exports = appsRouters
