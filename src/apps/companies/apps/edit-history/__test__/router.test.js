const router = require('../router')

describe('Edit history route', () => {
  it('should define both "Edit history" and "data" routes', () => {
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
        path: '/',
        methods: ['get'],
      },
      {
        path: '/data',
        methods: ['get'],
      },
    ])
  })
})
