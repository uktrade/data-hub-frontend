const sinon = require('sinon')
const allFeaturesOr404 = require('../all-features-or-404')

const NOT_FOUND_ERROR = 'not found error'
const NO_ARGUMENTS = 'no arguments'

const testCase = ({
  uut = allFeaturesOr404,
  activeFeatures,
  params,
  shouldCallNextWith,
}) => {
  if (![NO_ARGUMENTS, NOT_FOUND_ERROR].includes(shouldCallNextWith)) {
    throw Error(
      'Invalid value for `shouldCallNext` option. Valid options are: ' +
      `"${NOT_FOUND_ERROR}" and "${NO_ARGUMENTS}".`,
    )
  }

  const expectError = shouldCallNextWith === NOT_FOUND_ERROR

  const quote = a =>
    a.map(x => `"${x}"`).join(', ')

  const xpectedNextArgMsg = expectError
    ? 'Not Found error'
    : 'no arguments'
  const paramsMsg = params.length
    ? `params ${quote(params)}`
    : `no params`
  const msg = `Should call next() with ${xpectedNextArgMsg}, when ` +
    `called with ${paramsMsg} and active features are ${quote(activeFeatures)}.`

  const res = {
    locals: {
      // Convert a list of strings to props of an object with true values.
      features: activeFeatures.reduce((a, x) => ({ ...a, [x]: true }), {}),
    },
  }

  const next = sinon.spy()

  it(msg, () => {
    uut(...params)(null, res, next)

    const arg = next.firstCall.args[0]
    expect(next).to.have.been.called

    if (expectError) {
      expect(arg).to.be.instanceof(Error)
      expect(arg.message).to.equal('Not Found')
    } else {
      expect(arg).not.to.be.ok // A.K.A. falsy
    }
  })
}

describe('allFeaturesOr404', () => {
  testCase({
    activeFeatures: ['foo', 'bar', 'baz'],
    params: [],
    shouldCallNextWith: NO_ARGUMENTS,
  })

  testCase({
    activeFeatures: ['foo', 'bar', 'baz'],
    params: ['bing'],
    shouldCallNextWith: NOT_FOUND_ERROR,
  })

  testCase({
    activeFeatures: ['foo', 'bar', 'baz'],
    params: ['foo', 'bing'],
    shouldCallNextWith: NOT_FOUND_ERROR,
  })

  testCase({
    activeFeatures: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar', 'bing', 'baz'],
    shouldCallNextWith: NOT_FOUND_ERROR,
  })

  testCase({
    activeFeatures: ['foo', 'bar', 'baz'],
    params: ['foo'],
    shouldCallNextWith: NO_ARGUMENTS,
  })

  testCase({
    activeFeatures: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar'],
    shouldCallNextWith: NO_ARGUMENTS,
  })

  testCase({
    activeFeatures: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar', 'baz'],
    shouldCallNextWith: NO_ARGUMENTS,
  })
})
