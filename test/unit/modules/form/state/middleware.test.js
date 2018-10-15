const { setJourneyDetails } = require('~/src/modules/form/state/middleware.js')

const steps = require('../steps.js')()

describe('Form state middleware', () => {
  describe('#setJourneyDetails', () => {
    beforeEach(() => {
      this.req = {
        baseUrl: '/base',
      }
      this.res = {
        locals: {},
      }
      this.nextSpy = sinon.spy()

      setJourneyDetails({ steps }, steps[1], 1)(this.req, this.res, this.nextSpy)
    })

    it('should set the current step', () => {
      expect(this.res.locals.journey.currentStep).to.deep.equal(steps[1])
    })

    it('should set the current step ID', () => {
      expect(this.res.locals.journey.currentStepId).to.equal(1)
    })

    it('should set the steps', () => {
      expect(this.res.locals.journey.steps).to.deep.equal(steps)
    })

    it('should set the key', () => {
      expect(this.res.locals.journey.key).to.equal('/base/step-1')
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledOnce
    })
  })
})
