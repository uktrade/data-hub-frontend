export const urlTestExclusions = [
  // A11y errors
  { url: '/investment-projects/' },
  { url: '/my-tasks/' },
  { url: '/community/' },
  { url: '/my-referrals/' },
  { url: '/companies/:companyId/edit-history' },
  { url: '/companies/:companyId/exports' },
  { url: '/exportwins/' },
  { url: '/companies/:companyId/investments/large-capital-profile' },
  { url: '/companies/:companyId/account-management' },
  { url: '/company-lists/' },
  { url: '/events/:eventId/attendees/find-new' },
  { url: '/companies/:companyId/interactions/create' },
  { url: '/companies/:companyId/interactions' },
  { url: '/companies/:companyId/hierarchies/ghq/search' },
  { url: '/search/' },
  { url: '/search/:searchPath?' },
  { url: '/investments/projects/:investmentId/details' },
  { url: '/investments/projects/:investmentId/edit-details' },
  { url: '/investments/projects/:investmentId/edit-requirements' },
  { url: '/investments/projects/:investmentId/edit-team-members' },
  { url: '/investments/projects/:investmentId/edit-value' },
  { url: '/investments/projects/:investmentId/edit-history' },
  { url: '/investments/projects/:investmentId/team' },
  {
    url: '/investments/projects/:investmentId/edit-client-relationship-management',
  },
  { url: '/investments/projects/create/:companyId' },
  { url: '/investments/projects/:projectId/edit-project-management' },
  { url: '/investments/projects/:projectId/find-associated' },
  { url: '/investments/projects/:projectId/find-ukcompany' },
  { url: '/investments/projects/:projectId/remove-ukcompany' },
  { url: '/investments/projects/:projectId/remove-associated' },
  { url: '/investments/projects/:projectId/evaluation' },
  { url: '/investments/opportunities/:opportunityId/details' },
  { url: '/investments/opportunities/:opportunityId/interactions' },
  { url: '/omis/create' },
  { url: '/omis/:orderId' },
  { url: '/omis/:orderId/payment-receipt' },
  { url: '/omis/:orderId/work-order' },
  { url: '/omis/:orderId/edit/cancel-order' },
  { url: '/omis/:orderId/edit/assignees' },
  { url: '/omis/:orderId/edit/subscribers' },
  { url: '/omis/:orderId/edit/vat-status' },
  { url: '/omis/:orderId/edit/assignee-time' },
  { url: '/omis/:orderId/edit/complete-order' },
  { url: '/omis/:orderId/reconciliation/payment-receipt' },
  { url: '/reminders/' },
  { url: '/reminders/investments-estimated-land-dates/' },
  { url: '/reminders/investments-no-recent-interactions/' },
  { url: '/reminders/investments-outstanding-propositions/' },
  { url: '/reminders/companies-no-recent-interactions/' },
  { url: '/reminders/companies-new-interactions/' },
  { url: '/reminders/my-tasks-due-date-approaching/' },
  { url: '/reminders/my-tasks-task-assigned-to-me-from-others/' },
  { url: '/reminders/my-tasks-task-amended-by-others/' },
  { url: '/reminders/my-tasks-task-overdue/' },
  { url: '/reminders/my-tasks-task-completed/' },
  { url: '/reminders/settings/' },
  { url: '/reminders/settings/investments-estimated-land-dates/' },
  { url: '/reminders/settings/investments-no-recent-interactions/' },
  { url: '/reminders/settings/companies-no-recent-interactions/' },
  { url: '/reminders/settings/companies-new-interactions/' },
  { url: '/reminders/settings/my-tasks-due-date-approaching/' },
  { url: '/reminders/settings/my-tasks-task-assigned-to-me-from-others/' },
  { url: '/reminders/settings/my-tasks-task-amended-by-others/' },
  { url: '/reminders/settings/my-tasks-task-overdue/' },
  { url: '/reminders/settings/my-tasks-task-completed/' },
  { url: '/export/' },
  { url: '/tasks/:taskId/edit' },
  { url: '/companies/:companyId/overview' },
  // 404 errors and or no sandbox data available
  { url: '/companies/:companyId/audit' },
  { url: '/companies/:companyId/archive' },
  { url: '/companies/:companyId/unarchive' },
  { url: '/companies/:companyId/lists' },
  { url: '/companies/:companyId/manage-company-list' },
  { url: '/v4/dnb/:companyId/related-companies/count' },
  { url: '/company-lists/:listId/delete' },
  { url: '/company-lists/:listId/rename' },
  { url: '/contacts/:contactId/archive' },
  { url: '/contacts/:contactId/unarchive' },
  { url: '/events/aventri/:aventriEventId/registration/:status' },
  { url: '/investments/opportunities/:opportunityId' },
  { url: '/investments/:investmentId/edit-history' },
  { url: '/omis/edit/payment-reconciliation' },
  { url: '/export/:exportId/edit' },
  { url: '/export/:exportId/delete' },
  { url: '/investments/projects/:investmentId/interactions' },
  { url: '/investments/projects/:projectId/evidence' },
  { url: '/investments/projects/:projectId/evidence/:evidenceId/delete' },
  {
    url: '/companies/:companyId/referrals/:referralId/interactions/create/:theme/:kind',
  },
  { url: '/companies/:companyId/interactions/create/:theme/:kind' },
  { url: '/investments/projects/create/investment-type/info/:anchor' },
  { url: '/investments/:investmentId/interactions/:interactionsId' },
  { url: '/my-pipeline/:pipelineId/edit' },
  { url: '/my-pipeline/:pipelineId/archive' },
  { url: '/my-pipeline/:pipelineId/unarchive' },
  { url: '/my-pipeline/:pipelineId/delete' },
  { url: '/companies/:companyId/exports/history/:countryId' },
  { url: '/companies/:companyId/referrals/:referralId/interactions' },
  { url: '/interactions/create' },
  { url: '/interactions/create/:theme/:kind' },
  { url: '/interactions/activeEvents' },
  { url: '/activeEvents/' },
  {
    url: '/investments/projects/:projectId/edit-associated/:associatedProjectId',
  },
  { url: '/export/:exportId/details' },
  { url: '/omis/:orderId/edit/lead-adviser/:adviserId' },
  { url: '/interactions/ess/:essInteractionId/details' },
  {
    url: '/companies/:companyId/account-management/objective/:objectiveId/edit',
  },
  {
    url: '/companies/:companyId/account-management/objective/:objectiveId/archive',
  },
  {
    url: '/investments/projects/:investmentId/propositions/:propositionId/abandon',
  },
  {
    url: '/investments/projects/:investmentId/propositions/:propositionId/document',
  },
  {
    url: '/investments/projects/:investmentId/propositions/:propositionId/document/:documentId/delete',
  },
  {
    url: '/investments/projects/:investmentId/propositions/:propositionId/complete',
  },
  { url: '/investments/projects/:investmentId/propositions/:propositionId' },
  { url: '/companies/:companyId/hierarchies/ghq/:globalHqId/add' },
  { url: '/companies/:companyId/hierarchies/ghq/remove' },
  { url: '/companies/:companyId' },
  // API calls with redirect
  { url: '/tasks/:taskId/status-complete' },
  { url: '/tasks/:taskId/status-active' },
  { url: '/tasks/:taskId/archive' },
  { url: '/tasks/:taskId/unarchive' },
  // 501 errors
  { url: '/api-proxy/v4/company/:companyId/export-win' },
  { url: '/investments/projects/:projectId/edit-ukcompany/:companyId' },
  // Excluded urls
  { url: '/testing/' },
  { url: '//' },
  { url: '/oauth/' },
  { url: '/oauth/callback/' },
  { url: '/oauth/sign-out/' },
  { url: '/exportwins/pending/' },
  { url: '/exportwins/rejected/' },
  { url: '/exportwins/:winId/edit' },
  { url: '/exportwins/:winId/success' },
  { url: '/companies/:companyId/exportwins/:winId/customer-feedback' },
  { url: '/companies/:companyId/export/:exportId/exportwins/create' },
  { url: '/companies/e59a2b0f-7d84-4de7-bc1e-f70339f4255f/overview' },
  //TODO - Reinstate this link once the Aventri integration is back
  { url: '/events/aventri/:aventriEventId/details' },
  // Exclude all metadata
  { url: '/api-proxy/v4/metadata/likelihood-to-land' },
  { url: '/api-proxy/v4/metadata/investment-investor-type' },
  { url: '/api-proxy/v4/metadata/investment-involvement' },
  { url: '/api-proxy/v4/metadata/investment-specific-programme' },
  { url: '/api-proxy/v4/metadata/investment-project-stage' },
  { url: '/api-proxy/v4/metadata/investment-business-activity' },
  { url: '/api-proxy/v4/metadata/investment-type' },
  { url: '/api-proxy/v4/metadata/investment-strategic-driver' },
  { url: '/api-proxy/v4/metadata/order-service-type' },
  { url: '/api-proxy/v4/metadata/order-cancellation-reason' },
  { url: '/api-proxy/v4/metadata/omis-market' },
  { url: '/api-proxy/v4/metadata/salary-range' },
  { url: '/api-proxy/v4/metadata/fdi-value' },
  { url: '/api-proxy/v4/metadata/fdi-type' },
  { url: '/api-proxy/v4/metadata/turnover' },
  { url: '/api-proxy/v4/metadata/sector' },
  { url: '/api-proxy/v4/metadata/location-type' },
  { url: '/api-proxy/v4/metadata/event-type' },
  { url: '/api-proxy/v4/metadata/programme' },
  { url: '/api-proxy/v4/metadata/business-type' },
  { url: '/api-proxy/v4/metadata/evidence-tag' },
  { url: '/api-proxy/v4/metadata/employee-range' },
  { url: '/api-proxy/v4/metadata/country' },
  { url: '/api-proxy/v4/metadata/uk-region' },
  { url: '/api-proxy/v4/metadata/administrative-area' },
  { url: '/api-proxy/v4/metadata/referral-source-website' },
  { url: '/api-proxy/v4/metadata/referral-source-marketing' },
  { url: '/api-proxy/v4/metadata/referral-source-activity' },
  { url: '/api-proxy/v4/metadata/headquarter-type' },
  { url: '/api-proxy/v4/metadata/service' },
  { url: '/api-proxy/v4/metadata/communication-channel' },
  { url: '/api-proxy/v4/metadata/team' },
  { url: '/api-proxy/v4/metadata/policy-area' },
  { url: '/api-proxy/v4/metadata/policy-issue-type' },
  { url: '/api-proxy/v4/metadata/service-delivery-status' },
  { url: '/api-proxy/v4/metadata/capital-investment/investor-type' },
  {
    url: '/api-proxy/v4/metadata/capital-investment/required-checks-conducted',
  },
  { url: '/api-proxy/v4/metadata/capital-investment/deal-ticket-size' },
  {
    url: '/api-proxy/v4/metadata/capital-investment/large-capital-investment',
  },
  {
    url: '/api-proxy/v4/metadata/capital-investment/large-capital-investment-type',
  },
  { url: '/api-proxy/v4/metadata/capital-investment/return-rate' },
  { url: '/api-proxy/v4/metadata/capital-investment/time-horizon' },
  { url: '/api-proxy/v4/metadata/capital-investment/restriction' },
  { url: '/api-proxy/v4/metadata/capital-investment/construction-risk' },
  { url: '/api-proxy/v4/metadata/capital-investment/equity-percentage' },
  { url: '/api-proxy/v4/metadata/capital-investment/desired-deal-role' },
  { url: '/api-proxy/v4/metadata/capital-investment/asset-class-interest' },
  { url: '/api-proxy/v4/large-capital-opportunity/:opportunityId' },
  {
    url: '/api-proxy/v4/metadata/large-capital-opportunity/opportunity-value-type',
  },
  { url: '/api-proxy/v4/metadata/one-list-tier' },
  { url: '/api-proxy/v4/metadata/trade-agreement' },
]
