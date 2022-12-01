export const urlTestExclusions = {
  companies: [
    { url: '/:companyId/audit' },
    { url: '/:companyId/advisers' },
    { url: '/:companyId/archive' },
    { url: '/:companyId/lists' },
    { url: '/:companyId/manage-company-list' },
    { url: '/:companyId/dnb-hierarchy' },
    { url: '/:companyId/exports/history/:countryId' },
    { url: '/:companyId/referrals/:referralId/interactions' },
  ],
  contacts: [
    { url: '/:contactId/archive' },
    { url: '/:contactId/unarchive' },
    { url: ':companyId' },
  ],
  companyLists: [{ url: '/:listId/delete' }, { url: '/:listId/rename' }],
  events: [],
  omis: [{ url: ':companyId' }, { url: '/edit/payment-reconciliation' }],
}
