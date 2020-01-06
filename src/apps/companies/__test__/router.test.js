const router = require('../router')
const urls = require('../../../lib/urls')

describe('Company router', () => {
  it('should define all routes', () => {
    const paths = router.stack.filter(r => r.route).map(r => r.route.path)
    expect(paths).to.deep.equal(
      [
        '/',
        '/export',
        '/:companyId/archive',
        '/:companyId/unarchive',
        '/:companyId',
        '/:companyId/details',
        urls.companies.exports.index.route,
        urls.companies.exports.edit.route,
        '/:companyId/business-details',
        '/:companyId/hierarchies/ghq/search',
        '/:companyId/hierarchies/ghq/:globalHqId/add',
        '/:companyId/hierarchies/ghq/remove',
        '/:companyId/hierarchies/subsidiaries/search',
        '/:companyId/hierarchies/subsidiaries/:subsidiaryCompanyId/add',
        '/:companyId/contacts',
        '/:companyId/orders',
        '/:companyId/audit',
        '/:companyId/documents',
        '/:companyId/manage-company-list',
        '/:companyId/subsidiaries',
        '/:companyId/subsidiaries/link',
      ])
  })
})
