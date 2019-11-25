const sinon = require('sinon')
const permissions = require('../permissions')

describe('Permissions middleware', () => {
  it('Should add a hasPermission method to res.locals.user', () => {
    const res = {
      locals: {
        user: {
          permissions: [
            'foo-foo_foo.foo',
            'bar_bar.bar-bar',
            'baz.baz-baz_baz',
          ],
        },
      },
    }
    const next = sinon.stub()
    permissions(null, res, next)
    expect(res.locals.user.hasPermission('foo-foo_foo.foo')).to.be.true
    expect(res.locals.user.hasPermission('bar_bar.bar-bar')).to.be.true
    expect(res.locals.user.hasPermission('baz.baz-baz_baz')).to.be.true
    expect(res.locals.user.hasPermission('abc')).to.be.false
  })
})
