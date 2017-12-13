const FormController = require('~/src/apps/omis/controllers/form')

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
const metadataSectorMockData = [{
  id: '1',
  name: 'ICT',
}, {
  id: '2',
  name: 'Engineering',
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
    this.nextSpy = sandbox.spy()
    this.orderSaveStub = sandbox.stub()

    this.ControllerClass = proxyquire('~/src/apps/omis/apps/create/controllers/confirm', {
      '../../../../../lib/metadata': {
        countryOptions: metadataCountryMockData,
        sectorOptions: metadataSectorMockData,
      },
      '../../../models': {
        Order: {
          save: this.orderSaveStub,
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
        primary_market: '2',
        sector: '2',
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
              contact: {
                id: '1',
                first_name: 'Fred',
                last_name: 'Stevens',
              },
              primary_market: metadataCountryMockData[1],
              sector: {
                id: '2',
                name: 'Engineering',
              },
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
      this.resetSpy = sandbox.spy()
      this.destroySpy = sandbox.spy()
      this.reqMock = Object.assign({}, globalReq, {
        session: {
          token: 'token-12345',
        },
        sessionModel: {
          toJSON: sandbox.stub().returns({
            'csrf-secret': 'secret-key',
            errors: {},
            foo: 'bar',
            fizz: 'buzz',
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
      })

      it('should save an order', (done) => {
        const resMock = {
          redirect: (url) => {
            try {
              expect(this.orderSaveStub).to.have.been.calledWith('token-12345', {
                foo: 'bar',
                fizz: 'buzz',
              })
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
          redirect: sandbox.spy(),
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
