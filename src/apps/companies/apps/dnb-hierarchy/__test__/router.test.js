const router = require('../router')

describe('D&B hierarchy routes', () => {
  it('should define all routes', () => {
    const paths = router.stack.filter((r) => r.route).map((r) => r.route.path)
    expect(paths).to.deep.equal([
      '/:companyId/dnb-hierarchy',
      '/:companyId/dnb-hierarchy/data',
    ])
  })
})
