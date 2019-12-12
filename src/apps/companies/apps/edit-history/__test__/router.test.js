const router = require('../router')

describe('Edit history route', () => {
  it('should define an "Edit history" route', () => {
    const paths = router.stack.filter(r => r.route).map(r => {
      return {
        path: r.route.path,
        methods: Object.keys(r.route.methods).map(method => method),
      }
    })

    expect(paths).to.deep.equal([
      {
        'path': '/',
        'methods': [ 'get' ],
      },
    ])
  })
})
