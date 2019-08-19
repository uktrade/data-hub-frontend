const router = require('~/src/apps/companies/apps/add-company/router')

describe('Add company form routes', () => {
  it('should define route to "Add company form" form', () => {
    const paths = router.stack.filter(r => r.route).map(r => r.route.path)
    expect(paths).to.contain('/')
  })
})
