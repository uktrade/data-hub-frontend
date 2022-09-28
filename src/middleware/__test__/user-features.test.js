const userFeatures = require('../user-features')

describe('user-features middleware', () => {
  let req, res, next
  const featureFlagName = 'mock-user-flag'
  beforeEach(() => {
    res = {
      locals: {
        userFeatures: [],
      },
      redirect: sinon.spy(),
    }

    req = {
      method: 'GET',
      query: {},
    }

    next = sinon.spy()
  })

  describe('when the flag is active for the user', () => {
    it('sets isFeatureTesting to true', () => {
      res.locals.userFeatures = [featureFlagName]
      userFeatures(featureFlagName)(req, res, next)
      expect(res.locals.userFeatureGTMEvent).to.deep.equal({
        name: featureFlagName,
        event: 'featureFlag',
      })
      expect(res.locals.isFeatureTesting).to.be.true
      expect(next).to.have.been.called
    })
  })

  describe('when the flag is not active for the user', () => {
    it('sets isFeatureTesting to false', () => {
      userFeatures(featureFlagName)(req, res, next)
      expect(res.locals.userFeatureGTMEvent).to.be.undefined
      expect(res.locals.isFeatureTesting).to.be.false
      expect(next).to.have.been.called
    })
  })
})
