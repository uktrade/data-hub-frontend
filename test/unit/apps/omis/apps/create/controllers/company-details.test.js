const FormController = require('hmpo-form-wizard').Controller

const Controller = require('~/src/apps/omis/apps/create/controllers/company-details')

const contactsMockData = [{
  id: '1',
  first_name: 'Fred',
  last_name: 'Stevens',
}, {
  id: '2',
  first_name: 'Alex',
  last_name: 'George',
}]

describe('OMIS create company details controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
    this.controller = new Controller({ route: '/' })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('configure()', () => {
    beforeEach(() => {
      this.reqMock = Object.assign({}, globalReq, {
        form: {
          options: {
            fields: {
              contact: {},
            },
          },
        },
      })
      this.resMock = Object.assign({}, globalRes, {
        locals: {
          company: undefined,
        },
      })

      FormController.prototype.configure = this.sandbox.spy()
    })

    describe('when a company exists', () => {
      it('should set the list of contacts', () => {
        this.resMock.locals.company = {
          contacts: contactsMockData,
        }

        this.controller.configure(this.reqMock, this.resMock, this.nextSpy)

        expect(this.reqMock.form.options.fields.contact.options).to.deep.equal([
          {
            value: '2',
            label: 'Alex George',
          },
          {
            value: '1',
            label: 'Fred Stevens',
          },
        ])
        expect(FormController.prototype.configure).to.be.calledWith(this.reqMock, this.resMock, this.nextSpy)
      })
    })

    describe('when a company doesn\'t exist', () => {
      it('should set empty contacts', () => {
        this.controller.configure(this.reqMock, this.resMock, this.nextSpy)

        expect(this.reqMock.form.options.fields.contact.options).to.deep.equal([])
        expect(FormController.prototype.configure).to.be.calledWith(this.reqMock, this.resMock, this.nextSpy)
      })
    })
  })

  describe('getValues()', () => {
    beforeEach(() => {
      this.resMock = Object.assign({}, globalRes, {
        locals: {
          company: {
            id: '1234567890',
          },
        },
      })
    })

    describe('when the parent has set some values', () => {
      beforeEach(() => {
        FormController.prototype.getValues = (req, res, next) => {
          next(null, {
            foo: 'bar',
          })
        }
      })

      it('should set the correct values', (done) => {
        const nextMock = (e, values) => {
          try {
            expect(Object.keys(values).length).to.equal(2)
            expect(values).to.have.property('company')
            expect(values.company).to.equal('1234567890')
            done()
          } catch (err) {
            done(err)
          }
        }

        this.controller.getValues(globalReq, this.resMock, nextMock)
      })
    })

    describe('when the parent hasn\'t set some values', () => {
      beforeEach(() => {
        FormController.prototype.getValues = (req, res, next) => {
          next(null, {})
        }
      })

      it('should set the correct values', (done) => {
        const nextMock = (e, values) => {
          try {
            expect(Object.keys(values).length).to.equal(1)
            expect(values).to.have.property('company')
            expect(values.company).to.equal('1234567890')
            done()
          } catch (err) {
            done(err)
          }
        }

        this.controller.getValues(globalReq, this.resMock, nextMock)
      })
    })
  })
})
