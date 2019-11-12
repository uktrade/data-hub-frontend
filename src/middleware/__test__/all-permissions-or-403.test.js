const sinon = require('sinon')
const allPermissionsOr403 = require('../all-permissions-or-403')

const NOT_AUTHORIZED = 'not authorized error'
const NO_ARGUMENTS = 'no arguments'

const testCase = ({
  uut = allPermissionsOr403,
  permissions,
  params,
  shouldCallNextWith,
}) => {
  if (![NO_ARGUMENTS, NOT_AUTHORIZED].includes(shouldCallNextWith)) {
    throw Error(
      'Invalid value for `shouldCallNext` option. Valid options are: ' +
      `"${NOT_AUTHORIZED}" and "${NO_ARGUMENTS}".`,
    )
  }

  const expectError = shouldCallNextWith === NOT_AUTHORIZED

  const quote = a =>
    a.map(x => `"${x}"`).join(', ')

  const xpectedNextArgMsg = expectError
    ? 'Not Authorized error'
    : 'no arguments'
  const paramsMsg = params.length
    ? `params ${quote(params)}`
    : `no params`
  const msg = `Should call next() with ${xpectedNextArgMsg}, when ` +
    `called with ${paramsMsg} and user permissions are ${quote(permissions)}.`

  const res = {
    locals: {
      user: {
        permissions,
      },
    },
  }

  const next = sinon.spy()

  it(msg, () => {
    uut(...params)(null, res, next)

    const arg = next.firstCall.args[0]
    expect(next).to.have.been.called

    if (expectError) {
      expect(arg).to.be.instanceof(Error)
      expect(arg.message).to.equal('Not Authorized')
      expect(arg.statusCode).to.equal(403)
    } else {
      expect(arg).not.to.be.ok // A.K.A. falsy
    }
  })
}

describe('allPermissionsOr403', () => {
  testCase({
    permissions: ['foo', 'bar', 'baz'],
    params: [],
    shouldCallNextWith: NO_ARGUMENTS,
  })

  testCase({
    permissions: ['foo', 'bar', 'baz'],
    params: ['bing'],
    shouldCallNextWith: NOT_AUTHORIZED,
  })

  testCase({
    permissions: ['foo', 'bar', 'baz'],
    params: ['foo', 'bing'],
    shouldCallNextWith: NOT_AUTHORIZED,
  })

  testCase({
    permissions: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar', 'bing', 'baz'],
    shouldCallNextWith: NOT_AUTHORIZED,
  })

  testCase({
    permissions: ['foo', 'bar', 'baz'],
    params: ['foo'],
    shouldCallNextWith: NO_ARGUMENTS,
  })

  testCase({
    permissions: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar'],
    shouldCallNextWith: NO_ARGUMENTS,
  })

  testCase({
    permissions: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar', 'baz'],
    shouldCallNextWith: NO_ARGUMENTS,
  })
})
