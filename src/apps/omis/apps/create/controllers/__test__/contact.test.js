const FormController = require('../../../../controllers/form')
const Controller = require('../contact')
const companyMock = require('../../../../../../../test/unit/data/company.json')

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

describe('OMIS create contact controller', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.controller = new Controller({ route: '/' })
  })

  describe('middlewareLocals()', () => {
    beforeEach(() => {
      sinon.stub(FormController.prototype, 'middlewareLocals')
      sinon.stub(this.controller, 'use')

      this.controller.middlewareLocals()
    })

    it('should call parent method', () => {
      expect(FormController.prototype.middlewareLocals).to.have.been.calledOnce
    })

    it('should call set heading method', () => {
      expect(this.controller.use).to.have.been.calledWith(
        this.controller.setHeading
      )
    })

    it('should call set contacts method', () => {
      expect(this.controller.use).to.have.been.calledWith(
        this.controller.setContacts
      )
    })
  })

  describe('setHeading()', () => {
    beforeEach(() => {
      this.reqMock = {
        form: {
          options: {
            heading: 'Client contact for the company',
          },
        },
      }
      this.resMock = {
        locals: {},
      }
    })

    context('when a company exists', () => {
      beforeEach(() => {
        this.resMock.locals.company = companyMock
        this.controller.setHeading(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set heading to include company name', () => {
        expect(this.reqMock.form.options.heading).to.equal(
          'Client contact for Wonka Industries'
        )
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('setContacts()', () => {
    beforeEach(() => {
      this.reqMock = {
        form: {
          options: {
            fields: {
              contact: {
                options: [],
              },
            },
          },
        },
      }
      this.resMock = {
        locals: {},
      }
    })

    context('when a company exists', () => {
      beforeEach(() => {
        this.resMock.locals.company = companyMock
        this.resMock.locals.company.contacts = contactsMockData
        this.controller.setContacts(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should use contacts from company', () => {
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
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context("when a company doesn't exist", () => {
      beforeEach(() => {
        this.controller.setContacts(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should have default contact options', () => {
        expect(this.reqMock.form.options.fields.contact.options).to.deep.equal(
          []
        )
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })
})
