const router = require('~/src/apps/companies/apps/activity-feed/router')

describe('Activity feed routes', () => {
  it('should define route to activity feed app', () => {
    const paths = router.stack.filter(r => r.route).map(r => r.route.path)
    expect(paths).to.contain('/')
  })

  it('should define route to activity feed data endpoint', () => {
    const paths = router.stack.filter(r => r.route).map(r => r.route.path)
    expect(paths).to.contain('/data')
  })
})
