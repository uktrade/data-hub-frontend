const proxyquire = require('proxyquire')

const FormController = require('../../../../controllers/form')

const saveMockData = {
  id: '1234567890',
}
const metadataCountryMockData = [
  {
    id: '1',
    name: 'Country One',
  },
  {
    id: '2',
    name: 'Country Two',
  },
]
const metadataSectorMockData = [
  {
    id: '1',
    name: 'ICT',
  },
  {
    id: '2',
    name: 'Engineering',
  },
]
const contactsMockData = [
  {
    id: '1',
    first_name: 'Fred',
    last_name: 'Stevens',
  },
  {
    id: '2',
    first_name: 'Alex',
    last_name: 'George',
  },
]

describe('OMIS create confirm controller', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.orderSaveStub = sinon.stub()

    this.ControllerClass = proxyquire('../confirm', {
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

  describe('saveValues()', () => {
    beforeEach(() => {
      this.sessionSetSpy = sinon.spy()
      this.reqMock = Object.assign({}, globalReq, {
        session: {
          token: 'token-12345',
        },
        sessionModel: {
          set: this.sessionSetSpy,
          toJSON: sinon.stub().returns({
            'csrf-secret': 'secret-key',
            errors: {},
            foo: 'bar',
            fizz: 'buzz',
          }),
        },
      })
    })

    describe('when the order save was successful', () => {
      beforeEach(async () => {
        this.orderSaveStub.resolves(saveMockData)
        await this.controller.saveValues(this.reqMock, {}, this.nextSpy)
      })

      it('should call save method on order model', () => {
        expect(this.orderSaveStub).to.have.been.calledWith(this.reqMock, {
          foo: 'bar',
          fizz: 'buzz',
        })
      })

      it('should call next with no arguments', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })

      it('should call next with no arguments', () => {
        expect(this.sessionSetSpy).to.have.been.calledOnce
        expect(this.sessionSetSpy).to.have.been.calledWith(
          'order-id',
          '1234567890'
        )
      })
    })

    describe('when the order save was successful', () => {
      beforeEach(async () => {
        this.errorMock = new Error('Save Error')
        this.orderSaveStub.rejects((this.errorMock = new Error('Save Error')))

        await this.controller.saveValues(this.reqMock, {}, this.nextSpy)
      })

      it('should call next with the error', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith(this.errorMock)
      })
    })
  })

  describe('successHandler()', () => {
    beforeEach(() => {
      this.getStub = sinon.stub().returns(saveMockData.id)
      this.resetSpy = sinon.spy()
      this.destroySpy = sinon.spy()
      this.flashSpy = sinon.spy()
      this.redirectSpy = sinon.spy()

      this.reqMock = {
        form: {
          options: {},
        },
        sessionModel: {
          get: this.getStub,
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        journeyModel: {
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        flash: this.flashSpy,
      }
      this.resMock = {
        redirect: this.redirectSpy,
      }
    })

    context("when a success message doesn't exist", () => {
      beforeEach(() => {
        this.controller.successHandler(this.reqMock, this.resMock)
      })

      it('should reset the models', () => {
        expect(this.resetSpy).to.have.been.calledTwice
        expect(this.destroySpy).to.have.been.calledTwice
      })

      it('should not set a flash message', () => {
        expect(this.flashSpy).not.to.have.been.called
      })

      it('should redirect with to the order', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.have.been.calledWith(
          `/omis/${saveMockData.id}`
        )
      })
    })

    context('when a success message exists', () => {
      beforeEach(() => {
        this.reqMock.form.options.successMessage = 'Successfully handled'
        this.controller.successHandler(this.reqMock, this.resMock)
      })

      it('should set a flash message', () => {
        expect(this.flashSpy).to.have.been.calledOnce
        expect(this.flashSpy).to.have.been.calledWith(
          'success',
          'Successfully handled'
        )
      })
    })
  })
})
