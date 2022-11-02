const router = require('../router')

describe('Reminders router', () => {
  it('should define the /reminders routes', () => {
    const paths = router.stack.filter((r) => r.route).map((r) => r.route.path)
    expect(paths).to.deep.equal([
      '/estimated-land-date',
      '/no-recent-interaction',
      '/outstanding-propositions',
      '/settings/estimated-land-date',
      '/settings/no-recent-interaction',
    ])
  })
})
