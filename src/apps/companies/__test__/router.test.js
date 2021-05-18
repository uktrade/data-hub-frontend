const router = require('../router')

describe('Company router', () => {
  it('should define company routes', () => {
    const paths = router.stack.filter((r) => r.route).map((r) => r.route.path)
    expect(paths).to.deep.equal([
      '/',
      '/react',
      '/export',
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
      '/:companyId/contacts',
      '/:companyId/orders',
      '/:companyId/documents',
      '/:companyId/manage-company-list',
      '/:companyId/subsidiaries',
      '/:companyId/subsidiaries/link',
    ])
  })
})
