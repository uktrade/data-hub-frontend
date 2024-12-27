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
  '/export/:exportId/interactions',
  '/export/:exportId/interactions/details',
  '/export/:exportId/delete',
  '/exportwins',
  '/companies/:companyId/exportwins/create',
  '/companies/:companyId/export/:exportId/exportwins/create',
  '/exportwins/confirmed',
  '/exportwins/pending',
  '/exportwins/rejected',
  '/exportwins/:winId/success',
  '/companies/:companyId/exportwins/:winId/edit',
  '/companies/:companyId/exportwins/:winId/edit-success',
  '/companies/:companyId/exportwins/:winId/customer-feedback',
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
  '/investments/projects/:projectId/evidence/add-new',
  '/investments/projects/:projectId/evidence/:documentId/delete',
  '/investments/projects/:projectId/admin',
  '/investments',
  '/investments/projects',
  '/investments/profiles',
  '/investments/opportunities',
  '/omis/:orderId/edit/quote-details',
  '/tasks/:taskId',
  '/omis/:orderId/edit/internal-details',
  '/investments/projects/:projectId/tasks',
  '/omis/:orderId/edit/payment-reconciliation',
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
  '/reminders/my-tasks-task-assigned-to-me-from-others',
  '/reminders/my-tasks-task-amended-by-others',
  '/reminders/my-tasks-task-overdue',
  '/reminders/my-tasks-task-completed',
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
  '/investments/projects/:projectId/propositions/:propositionId/document/:documentId/delete',
  '/events/:eventId/attendees/find-new',
  '/interactions/ess/:essInteractionId/details',
  '/investments/opportunities/create',
  '/investments/opportunities/:opportunityId/status',
  '/investments/opportunities/:opportunityId/details',
  '/investments/opportunities/:opportunityId/interactions',
  '/omis/create',
  '/omis/create/:companyId',
  '/omis/:orderId/payment-receipt',
  '/omis/:orderId/reconciliation/payment-receipt',
  '/tasks/:taskId/details',
  '/tasks/create',
  '/tasks/:taskId/edit',
  '/companies/:companyId/overview',
  '/companies/:companyId/business-details',
  '/companies/:companyId/hierarchies/ghq/:globalHqId/add',
  '/companies/:companyId/hierarchies/ghq/remove',
  '/companies/:companyId/activity',
  '/companies/:companyId/contacts',
  '/companies/:companyId/orders',
  '/companies/:companyId/account-management',
  '/companies/:companyId/investments',
  '/companies/:companyId/investments/projects',
  '/companies/:companyId/investments/large-capital-profile',
  '/companies/:companyId/exports',
  '/companies/:companyId/exports/history',
  '/companies/:companyId/exports/history/:countryId',
  '/omis/:orderId/quote',
  '/omis/reconciliation',
  '/companies/:companyId/edit-history',
  '/investments/projects/:projectId/propositions/:propositionId/document',
  '/investments/eyb-leads',
  '/investments/eyb-leads/:eybLeadId/details',
  '/companies/:companyId/referrals/send',
  '/companies/:companyId/referrals/:referralId',
  '/contacts/:contactId/details',
  '/contacts/:contactId/interactions',
  '/contacts/:contactId/audit',
  '/companies/:companyId/match/cannot-find',
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
