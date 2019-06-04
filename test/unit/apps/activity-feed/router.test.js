const router = require('../../../../src/apps/activity-feed/router')

describe('Activity feed routes', () => {
  it('should define /api/activity-feed route', () => {
    const paths = router.stack.filter(r => r.route).map(r => r.route.path)
    expect(paths).to.contain('/api/activity-feed')
  })
})
