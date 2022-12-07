export const urlTestExclusions = {
  companies: [
    // 404 errors for the below
    { url: '/companies/:companyId/audit' },
    { url: '/companies/:companyId/archive' },
    { url: '/companies/:companyId/lists' },
    { url: '/companies/:companyId/manage-company-list' },
    // don't have permission to view this page
    { url: '/companies/:companyId/dnb-hierarchy' },
    // No history countryId for the sandbox companyId
    { url: '/companies/:companyId/exports/history/:countryId' },
    { url: '/companies/:companyId/referrals/:referralId/interactions' },
  ],
  companyLists: [
    { url: '/company-lists/:listId/delete' },
    { url: '/company-lists/:listId/rename' },
  ],
  contacts: [
    // 404 errors for the below
    { url: '/contacts/:contactId/archive' },
    { url: '/contacts/:contactId/unarchive' },
  ],
  events: [],
  dashboard: [],
  interactions: [
    { url: '/interactions/create' },
    { url: '/interactions/create/:theme/:kind' },
    { url: '/interactions/activeEvents' },
    { url: '/activeEvents/' },
  ],
  investments: [
    // don't have permission to view this page
    { url: '/investments/projects/:investmentId/propositions' },
    { url: '/investments/projects/:investmentId/propositions/:propositionId' },
    // 404 error for the below
    { url: '/investments/opportunities/:opportunityId' },
    // No sandbox data available for testing the below locations
    { url: '/investments/projects/create/investment-type/info/:anchor' },
    // 404 error for the below
    { url: '/investments/:investmentId/edit-history' },
    // No sandbox data available for testing the below locations
    { url: '/investments/:investmentId/interactions/:interactionsId' },
  ],
  omis: [
    // 404 error for the below
    { url: '/omis/edit/payment-reconciliation' },
  ],
  pipelines: [
    // No sandbox data available for testing the below locations
    { url: '/my-pipeline/:pipelineId/edit' },
    { url: '/my-pipeline/:pipelineId/archive' },
    { url: '/my-pipeline/:pipelineId/unarchive' },
    { url: '/my-pipeline/:pipelineId/delete' },
  ],
  reminders: [],
  search: [],
}
