const FormController = require('hmpo-form-wizard').Controller

const getAdvisersMockData = require('~/test/unit/data/investment/interaction/advisers')
const saveMockData = {
  id: '1234567890',
}
const metadataCountryMockData = [{
  id: '1',
  name: 'Country One',
}, {
  id: '2',
  name: 'Country Two',
}]
const contactsMockData = [{
  id: '1',
  first_name: 'Fred',
  last_name: 'Stevens',
}, {
  id: '2',
  first_name: 'Alex',
  last_name: 'George',
}]

describe('OMIS create confirm controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
    this.getAdvisersStub = this.sandbox.stub().resolves(getAdvisersMockData)
    this.orderSaveStub = this.sandbox.stub()
    this.saveSubscribersStub = this.sandbox.stub()

    this.ControllerClass = proxyquire('~/src/apps/omis/apps/create/controllers/confirm', {
      '../../../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
      '../../../../../lib/metadata': {
        countryOptions: metadataCountryMockData,
      },
      '../../../models': {
        Order: {
          save: this.orderSaveStub,
          saveSubscribers: this.saveSubscribersStub,
        },
      },
    })

    this.controller = new this.ControllerClass({ route: '/' })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('getValues()', () => {
    beforeEach(() => {
      this.resMock = Object.assign({}, globalRes, {
        locals: {
          company: {
            id: '1234567890',
            contacts: contactsMockData,
          },
        },
      })
      this.valuesMock = {
        contact: '1',
        company: 'company-12345',
        ita: ['0513453c-86bc-e211-a646-e4115bead28a'],
        primary_market: '2',
      }
    })

    describe('when the parent has set some values', () => {
      beforeEach(() => {
        FormController.prototype.getValues = (req, res, next) => {
          next(null, this.valuesMock)
        }
      })

      it('should set the correct values', (done) => {
        const nextMock = (e, values) => {
          try {
            expect(Object.keys(values).length).to.equal(4)
            expect(values).to.deep.equal({
              company: {
                id: '1234567890',
                contacts: contactsMockData,
              },
              contact: 'Fred Stevens',
              primary_market: metadataCountryMockData[1],
              ita: [getAdvisersMockData.results[0].name],
            })
            done()
          } catch (err) {
            done(err)
          }
        }

        this.controller.getValues(globalReq, this.resMock, nextMock)
      })
    })
  })

  describe('successHandler()', () => {
    beforeEach(() => {
      this.resetSpy = this.sandbox.spy()
      this.destroySpy = this.sandbox.spy()
      this.reqMock = Object.assign({}, globalReq, {
        session: {
          token: 'token-12345',
        },
        sessionModel: {
          toJSON: this.sandbox.stub().returns({
            'csrf-secret': 'secret-key',
            errors: {},
            foo: 'bar',
            fizz: 'buzz',
            ita: ['12345', '67890'],
          }),
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        journeyModel: {
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
      })
    })

    describe('when the order save was successful', () => {
      beforeEach(() => {
        this.orderSaveStub.resolves(saveMockData)
        this.saveSubscribersStub.resolves([])
      })

      it('should save an order', (done) => {
        const resMock = {
          redirect: (url) => {
            try {
              expect(this.orderSaveStub).to.have.been.calledWith('token-12345', {
                foo: 'bar',
                fizz: 'buzz',
                ita: ['12345', '67890'],
              })
              expect(this.saveSubscribersStub).to.have.been.calledWith('token-12345', '1234567890', [
                { id: '12345' },
                { id: '67890' },
              ])
              expect(this.resetSpy).to.have.been.calledTwice
              expect(this.destroySpy).to.have.been.calledTwice
              expect(this.nextSpy).not.to.have.been.called
              expect(url).to.equal(`/omis/${saveMockData.id}`)
              done()
            } catch (e) {
              done(e)
            }
          },
        }

        this.controller.successHandler(this.reqMock, resMock, this.nextSpy)
      })
    })

    describe('when the order save was successful', () => {
      beforeEach(() => {
        this.orderSaveStub.rejects(new Error())
      })

      it('should save an order', (done) => {
        const resMock = {
          redirect: this.sandbox.spy(),
        }
        const nextMock = (error) => {
          try {
            expect(error).to.be.an('error')
            expect(resMock.redirect).to.not.have.been.called
            expect(this.resetSpy).to.not.have.been.called
            done()
          } catch (e) {
            done(e)
          }
        }

        this.controller.successHandler(this.reqMock, resMock, nextMock)
      })
    })
  })
})
