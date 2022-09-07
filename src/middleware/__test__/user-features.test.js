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

  describe('when the flag is actives for the user', () => {
    it('redirects to url with featuretesting param', () => {
      res.locals.userFeatures = [featureFlagName]
      userFeatures(featureFlagName)(req, res, next)
      expect(res.redirect).to.have.been.calledWith(
        `?featureTesting=${featureFlagName}`
      )
      expect(res.locals.isFeatureTesting).to.be.true
    })
  })

  describe('when the flag is not active for the user', () => {
    it('redirects to url with featuretesting param', () => {
      userFeatures(featureFlagName)(req, res, next)
      expect(res.redirect).to.not.have.been.called
      expect(next).to.have.been.called
      expect(res.locals.isFeatureTesting).to.be.false
    })
  })
})
