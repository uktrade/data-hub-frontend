const fs = require('fs')

const router = require('express').Router()

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
  '/export/create',
  '/export/:exportId/edit',
  '/export/:exportId/details',
  '/export/:exportId/delete',
  '/exportwins',
  '/exportwins/create',
  '/exportwins/confirmed',
  '/exportwins/unconfirmed',
  '/exportwins/:winId/details',
  '/companies/:companyId/dnb-hierarchy',
  '/companies/:companyId/company-tree',
  '/companies/:companyId/account-management/strategy/create',
  '/companies/:companyId/account-management/strategy/edit',
  '/investments/projects/:projectId/status',
  '/companies/:companyId/account-management/objective/create',
  '/companies/:companyId/account-management/objective/:objectiveId/edit',
  '/companies/:companyId/account-management/objective/edit',
  '/companies/:companyId/account-management/objective/archived',
  '/companies/:companyId/account-management/objective/:objectiveId/archive',
  '/investments/projects/:projectId/find-associated',
  '/investments/projects/:projectId/edit-associated/:associatedProjectId',
  '/investments/projects/:projectId/remove-associated',
  '/investments/projects/:projectId/find-ukcompany',
  '/investments/projects/:projectId/edit-ukcompany/:companyId',
  '/investments/projects/:projectId/remove-ukcompany',
  '/companies/:companyId/edit-one-list',
  '/community',
  '/investments/projects/:projectId/details',
  '/investments/projects/:projectId/edit-details',
  '/investments/projects/:projectId/edit-requirements',
  '/investments/projects/:projectId/edit-value',
  '/investments/projects/:projectId/team',
  '/investments/projects/:projectId/evaluation',
  '/investments/projects/:projectId/interactions',
  '/investments/projects/:projectId/propositions',
  '/investments/projects/:projectId/edit-client-relationship-management',
  '/investments/projects/:projectId/edit-project-management',
  '/investments/projects/:projectId/edit-team-members',
  '/investments/projects/:projectId/edit-history',
  '/investments/projects/:projectId/evidence',
  '/investments/projects/:projectId/evidence/:documentId/delete',
  '/investments',
  '/investments/projects',
  '/investments/profiles',
  '/investments/opportunities',
  '/omis/:orderId/edit/quote-details',
  '/tasks/:taskId',
  '/omis/:orderId/edit/internal-details',
  '/investments/projects/:projectId/tasks/create',
  '/investments/projects/:projectId/tasks',
  '/omis/:orderId/edit/payment-reconciliation',
  '/investments/projects/:projectId/tasks/:taskId/edit',
  '/reminders/my-tasks-due-date-approaching',
  '/omis/:orderId/edit/invoice-details',
  '/omis/:orderId/edit/billing-address',
  '/omis/:orderId/edit/vat-status',
  '/omis/:orderId/edit/cancel-order',
  '/reminders/settings/:reminderType',
  '/omis/:orderId/edit/assignee-time',
  '/omis/:orderId/edit/complete-order',
  '/omis/:orderId/edit/contact',
  '/omis/:orderId/edit/assignees',
  '/omis/:orderId/edit/subscribers',
  '/reminders/task-assigned-to-me-from-others',
  '/reminders/my-tasks-task-overdue',
  '/omis/:orderId/work-order',
  '/omis/:orderId/edit/lead-adviser/:adviserId',
  '/companies/:companyId/hierarchies/ghq/search',
  '/companies/:companyId/subsidiaries/link',
  '/companies/:companyId/hierarchies/subsidiaries/search',
  '/companies/:companyId/exports/edit-countries',
  '/companies/:companyId/exports/edit',
  '/companies/:companyId/referrals/:referralId/help',
  '/investments/projects/:projectId/propositions/:propositionId/abandon',
  '/investments/projects/:projectId/propositions/create/proposition',
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
