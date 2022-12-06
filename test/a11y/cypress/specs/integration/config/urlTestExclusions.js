export const urlTestExclusions = {
  companies: [
    { url: '/companies/:companyId/audit' },
    { url: '/companies/:companyId/advisers' },
    { url: '/companies/:companyId/archive' },
    { url: '/companies/:companyId/lists' },
    { url: '/companies/:companyId/manage-company-list' },
    { url: '/companies/:companyId/dnb-hierarchy' },
    { url: '/companies/:companyId/exports/history/:countryId' },
    { url: '/companies/:companyId/referrals/:referralId/interactions' },
  ],
  contacts: [
    { url: '/contacts/:contactId/archive' },
    { url: '/contacts/:contactId/unarchive' },
    { url: '/contacts/:companyId' },
  ],
  companyLists: [
    { url: '/company-lists/:listId/delete' },
    { url: '/company-lists/:listId/rename' },
  ],
  dashboard: [],
  investments: [
    { url: '/investments/projects/:investmentId/propositions' },
    { url: '/investments/projects/:investmentId/propositions/:propositionId' },
    { url: '/investments/opportunities/:opportunityId' },
    { url: '/investments/projects/create/investment-type/info/:anchor' },
    { url: '/investments/:investmentId/edit-history' },
    { url: '/investments/:investmentId/interactions/:interactionsId' },
  ],
  omis: [
    { url: '/omis/:companyId' },
    { url: '/omis/edit/payment-reconciliation' },
  ],
}
