const router = require('~/src/apps/companies/apps/add-company/router')

describe('Add company form routes', () => {
  it('should define route to "Add company form" form', () => {
    const paths = router.stack.filter(r => r.route).map(r => {
      return {
        path: r.route.path,
        methods: Object.keys(r.route.methods).map(method => method),
      }
    })

    expect(paths).to.deep.equal([
      { path: '/', methods: [ 'get', 'post' ] },
      { path: '/dnb/company-search', methods: [ 'post' ] },
    ])
  })
})
