const sinon = require('sinon')
const { allFeaturesOr404, allPermissionsOr403 } = require('../conditionals')
const { NotFoundError, NotAuthorizedError } = require('../errors')

const testCase =
  ({ uut, stubDescription, expectedError, localsStub }) =>
  ({ localsStubParams, params, expectError }) => {
    const quote = (a) => a.map((x) => `"${x}"`).join(', ')

    const xpectedNextArgMsg = expectError
      ? `"${expectedError}"`
      : 'no arguments'
    const paramsMsg = params.length ? `params ${quote(params)}` : `no params`
    const msg =
      `Should call next() with ${xpectedNextArgMsg}, when ` +
      `called with ${paramsMsg} and ${stubDescription} are ` +
      `${quote(localsStubParams)}.`

    const res = { locals: localsStub(localsStubParams) }
    const next = sinon.spy()

    it(msg, () => {
      uut(...params)(null, res, next)

      const arg = next.firstCall.args[0]
      expect(next).to.have.been.called

      if (expectError) {
        expect(arg).to.be.instanceof(Error)
        expect(arg.message).to.equal(expectedError.message)
        expect(arg.statusCode).to.equal(expectedError.statusCode)
      } else {
        expect(arg).not.to.be.ok // A.K.A. falsy
      }
    })
  }

const testCase404 = testCase({
  uut: allFeaturesOr404,
  stubDescription: 'active features',
  expectedError: new NotFoundError(),
  localsStub: (params) => ({
    // Convert a list of strings to props of an object with true values.
    features: params.reduce((a, x) => ({ ...a, [x]: true }), {}),
  }),
})

const testCase403 = testCase({
  uut: allPermissionsOr403,
  fixtureParamsName: 'active permissions',
  expectedError: new NotAuthorizedError(),
  localsStub: (params) => ({
    user: {
      permissions: params,
    },
  }),
})

const expectations = [
  {
    localsStubParams: ['foo', 'bar', 'baz'],
    params: [],
    expectError: false,
  },
  {
    localsStubParams: ['foo', 'bar', 'baz'],
    params: ['bing'],
    expectError: true,
  },
  {
    localsStubParams: ['foo', 'bar', 'baz'],
    params: ['foo', 'bing'],
    expectError: true,
  },
  {
    localsStubParams: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar', 'bing', 'baz'],
    expectError: true,
  },
  {
    localsStubParams: ['foo', 'bar', 'baz'],
    params: ['foo'],
    expectError: false,
  },
  {
    localsStubParams: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar'],
    expectError: false,
  },
  {
    localsStubParams: ['foo', 'bar', 'baz'],
    params: ['foo', 'bar', 'baz'],
    expectError: false,
  },
]

describe('Conditional middleware', () => {
  describe('allFeaturesOr404', () => expectations.forEach(testCase404))
  describe('allPermissionsOr403', () => expectations.forEach(testCase403))
})
