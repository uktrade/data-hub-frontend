const router = require('../router')

describe('Match company route', () => {
  it('should define an "Match company" route', () => {
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
        path: '/:companyId/match',
        methods: ['get'],
      },
    ])
  })
})
