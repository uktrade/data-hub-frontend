const router = require('../router')

describe('Edit company form routes', () => {
  it('should define route to "Edit company form" form', () => {
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
      {
        'path': '/',
        'methods': [ 'post' ],
      },
    ])
  })
})
