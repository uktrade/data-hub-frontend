const router = require('../router')

describe('Exports route', () => {
  it('should define an "Exports" route', () => {
    const paths = router.stack
      .filter((r) => r.route)
      .map((r) => {
        return {
          path: r.route.path,
          methods: Object.keys(r.route.methods).map((method) => method),
        }
      })

    expect(paths).to.deep.equal([
      {
        path: '/:companyId/exports',
        methods: ['get'],
      },
      {
        path: '/:companyId/exports/edit',
        methods: ['get', 'post'],
      },
    ])
  })
})
