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
  contacts: [
    // 404 errors for the below
    { url: '/contacts/:contactId/archive' },
    { url: '/contacts/:contactId/unarchive' },
  ],
  companyLists: [
    { url: '/company-lists/:listId/delete' },
    { url: '/company-lists/:listId/rename' },
  ],
  dashboard: [],
  interactions: [],
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
    { url: '/my-pipeline/:pipelineItemId/edit' },
    { url: '/my-pipeline/:pipelineItemId/archive' },
    { url: '/my-pipeline/:pipelineItemId/unarchive' },
    { url: '/my-pipeline/:pipelineItemId/delete' },
  ],
}
