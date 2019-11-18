const router = require('~/src/apps/companies/router.js')

describe('Company router', () => {
  it('should define all routes', () => {
    const paths = router.stack.filter(r => r.route).map(r => r.route.path)
    expect(paths).to.deep.equal([ '/',
      '/export',
      '/:companyId/exports/edit',
      '/:companyId/archive',
      '/:companyId/unarchive',
      '/:companyId',
      '/:companyId/details',
      '/:companyId/business-details',
      '/:companyId/hierarchies/ghq/search',
      '/:companyId/hierarchies/ghq/:globalHqId/add',
      '/:companyId/hierarchies/ghq/remove',
      '/:companyId/hierarchies/subsidiaries/search',
      '/:companyId/hierarchies/subsidiaries/:subsidiaryCompanyId/add',
      '/:companyId/dnb-subsidiaries',
      '/:companyId/dnb-subsidiaries/data',
      '/:companyId/contacts',
      '/:companyId/exports',
      '/:companyId/subsidiaries',
      '/:companyId/subsidiaries/link',
      '/:companyId/orders',
      '/:companyId/audit',
      '/:companyId/documents',
      '/:companyId/manage-company-list' ],
    )
  })
})
