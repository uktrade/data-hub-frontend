const { validateState, setJourneyDetails } = require('~/src/modules/form/state/middleware.js')
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

  describe('#validateState', () => {
    context('when starting the journey', () => {
      beforeEach(() => {
        this.req = {
          session: {},
          baseUrl: '/base',
        }
        this.res = {
          locals: {
            journey: {
              steps,
              currentStepId: 0,
              key: '/base/step-1',
            },
          },
          redirect: sinon.spy(),
        }
        this.nextSpy = sinon.spy()

        validateState(this.req, this.res, this.nextSpy)
      })

      it('should call next once', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should not redirect', () => {
        expect(this.res.redirect).to.not.be.called
      })
    })

    context('when steps 1 and 3 have been completed and then rendering step 5', () => {
      beforeEach(() => {
        this.req = {
          session: {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      selectedAtStep1: 'step-3-value',
                    },
                    completed: true,
                  },
                  '/step-3': {
                    data: {
                      selectedAtStep3: 'step-5-value',
                    },
                    completed: true,
                  },
                },
              },
            },
          },
          baseUrl: '/base',
        }
        this.res = {
          locals: {
            journey: {
              steps,
              currentStepId: 4,
              key: '/base/step-1',
            },
          },
          redirect: sinon.spy(),
        }
        this.nextSpy = sinon.spy()

        validateState(this.req, this.res, this.nextSpy)
      })

      it('should call next once', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should not redirect', () => {
        expect(this.res.redirect).to.not.be.called
      })
    })

    context('when step 3 has not been completed and then rendering step 5', () => {
      beforeEach(() => {
        this.req = {
          session: {
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      selectedAtStep1: 'step-3-value',
                    },
                    completed: true,
                  },
                  '/step-3': {
                    data: {
                      selectedAtStep3: 'step-5-value',
                    },
                  },
                },
              },
            },
          },
          baseUrl: '/base',
        }
        this.res = {
          locals: {
            journey: {
              steps,
              currentStepId: 4,
              key: '/base/step-1',
            },
          },
          redirect: sinon.spy(),
        }
        this.nextSpy = sinon.spy()

        validateState(this.req, this.res, this.nextSpy)
      })

      it('should not call next', () => {
        expect(this.nextSpy).to.not.be.called
      })

      it('should redirect', () => {
        expect(this.res.redirect).to.be.calledOnce
        expect(this.res.redirect).to.be.calledWith('/base/step-1')
      })
    })

    context('when starting with step 2 which does not require previously completed steps', () => {
      beforeEach(() => {
        this.req = {
          session: {
            'multi-step': {
              '/base/step-1': {},
            },
          },
          baseUrl: '/base',
        }
        this.res = {
          locals: {
            journey: {
              steps,
              currentStepId: 1,
              key: '/base/step-1',
            },
          },
          redirect: sinon.spy(),
        }
        this.nextSpy = sinon.spy()

        validateState(this.req, this.res, this.nextSpy)
      })

      it('should call next once', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should not redirect', () => {
        expect(this.res.redirect).to.not.be.called
      })
    })
  })
})
