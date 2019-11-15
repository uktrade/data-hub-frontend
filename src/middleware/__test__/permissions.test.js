const sinon = require('sinon')
const permissions = require('../permissions')

describe('Permissions middleware', () => {
  it('Should add a map from camel-cased permissions to `true` to `res.session.user.hasPermission`', () => {
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
    expect(res.locals.user.hasPermission).to.deep.equal({
      fooFooFooFoo: true,
      barBarBarBar: true,
      bazBazBazBaz: true,
    })
    expect(next).to.have.been.calledOnce
    expect(next).to.have.been.calledWith()
  })
})
