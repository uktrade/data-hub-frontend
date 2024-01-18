const router = require('../router')

describe('Company router', () => {
  it('should define company routes', () => {
    const paths = router.stack.filter((r) => r.route).map((r) => r.route.path)
    expect(paths).to.deep.equal([
      '/export',
      '/:companyId/archive',
      '/:companyId/unarchive',
      '/:companyId',
      '/:companyId/details',
      '/:companyId/hierarchies/subsidiaries/:subsidiaryCompanyId/add',
      '/:companyId/orders',
      '/:companyId/manage-company-list',
      '/:companyId/subsidiaries',
    ])
  })
})
