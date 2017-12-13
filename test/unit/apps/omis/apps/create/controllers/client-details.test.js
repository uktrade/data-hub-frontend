const FormController = require('~/src/apps/omis/controllers/form')

const Controller = require('~/src/apps/omis/apps/create/controllers/client-details')

const contactsMockData = [{
  id: '1',
  first_name: 'Fred',
  last_name: 'Stevens',
}, {
  id: '2',
  first_name: 'Alex',
  last_name: 'George',
}]

describe('OMIS create client details controller', () => {
  beforeEach(() => {
    this.nextSpy = sandbox.spy()
    this.breadcrumbStub = sandbox.stub().returnsThis()
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
            heading: 'Client contact for the client company',
            fields: {
              contact: {},
            },
          },
        },
      })
      this.resMock = Object.assign({}, globalRes, {
        breadcrumb: this.breadcrumbStub,
        locals: {
          company: undefined,
        },
      })

      sandbox.spy(FormController.prototype, 'configure')
    })

    describe('when a company exists', () => {
      beforeEach(() => {
        this.resMock.locals.company = {
          name: 'Company',
          contacts: contactsMockData,
        }

        this.controller.configure(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set the list of contacts', () => {
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

      it('should update the heading', () => {
        expect(this.reqMock.form.options.heading).to.equal('Client contact for Company')
      })

      it('should call the parent method', () => {
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

  describe('process()', () => {
    beforeEach(() => {
      this.resMock = Object.assign({}, globalRes, {
        locals: {
          company: {
            id: '1234567890',
          },
        },
      })
    })

    it('should set the locals company ID to form values', (done) => {
      const reqMock = Object.assign({}, globalReq, {
        form: { values: {} },
      })
      const nextMock = () => {
        try {
          expect(reqMock.form.values).to.have.property('company')
          expect(reqMock.form.values.company).to.equal('1234567890')
          done()
        } catch (err) {
          done(err)
        }
      }

      this.controller.process(reqMock, this.resMock, nextMock)
    })
  })
})
