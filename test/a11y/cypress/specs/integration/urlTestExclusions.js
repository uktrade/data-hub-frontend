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

  events: [],
}
