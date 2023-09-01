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
  '/companies/:companyId/account-management/strategy/create',
  '/companies/:companyId/account-management/strategy/edit',
  '/investments/projects/:projectId/status',
  '/companies/:companyId/account-management/objective/create',
  '/companies/:companyId/account-management/objective/:objectiveId/edit',
  '/companies/:companyId/account-management/objective/edit',
  '/companies/:companyId/account-management/objective/archived',
  '/investments/projects/:projectId/find-associated',
  '/investments/projects/:projectId/edit-associated/:associatedProjectId',
  '/investments/projects/:projectId/remove-associated',
  '/investments/projects/:projectId/find-ukcompany',
  '/investments/projects/:projectId/edit-ukcompany/:companyId',
  '/investments/projects/:projectId/remove-ukcompany',
  '/companies/:companyId/edit-one-list',
  '/investments/projects/:projectId/details',
  '/investments/projects/:projectId/edit-details',
  '/investments/projects/:projectId/edit-requirements',
  '/investments/projects/:projectId/edit-value',
  '/investments/projects/:projectId/team',
  '/investments/projects/:projectId/evaluation',
  '/investments/projects/:projectId/interactions',
  '/investments/projects/:projectId/propositions',
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
