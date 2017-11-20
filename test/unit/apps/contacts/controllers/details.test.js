const { assign } = require('lodash')

const contact = require('~/test/unit/data/contacts/contact.json')

describe('Contact controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.getContactStub = this.sandbox.stub().resolves(contact)
    this.getDitCompanyStub = this.sandbox.stub().resolves(contact.company)

    this.transformerStub = this.sandbox.stub()

    this.contactController = proxyquire('~/src/apps/contacts/controllers/details', {
      '../repos': {
        getContact: this.getContactStub,
      },
      '../../companies/repos': {
        getDitCompany: this.getDitCompanyStub,
      },
      '../transformers': {
        transformContactToView: this.transformerStub,
      },
    })

    this.req = {
      session: {
        token: 'abcd',
      },
      params: {
        contactId: '12651151-2149-465e-871b-ac45bc568a62',
      },
    }

    this.res = {
      locals: {},
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
    }

    this.next = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getCommon', () => {
    it('should get the contact ID', async () => {
      await this.contactController.getCommon(this.req, this.res, this.next)

      expect(this.res.locals.id).to.equal(this.req.params.contactId)
      expect(this.next).to.have.been.calledOnce
    })

    it('should get the reason for archive options', async () => {
      await this.contactController.getCommon(this.req, this.res, this.next)

      const expected = [
        'Left the company',
        'Does not want to be contacted',
        'Changed role/responsibility',
      ]

      expect(this.res.locals.reasonForArchiveOptions).to.deep.equal(expected)
      expect(this.next).to.have.been.calledOnce
    })

    it('should get the reason for archive options prefix', async () => {
      await this.contactController.getCommon(this.req, this.res, this.next)

      expect(this.res.locals.reasonForArchiveOptionsPrefix).to.equal('This contact has:')
      expect(this.next).to.have.been.calledOnce
    })

    it('should handle an error', async () => {
      const error = Error('error')
      this.getContactStub.rejects(error)

      await this.contactController.getCommon(this.req, this.res, this.next)

      expect(this.next).to.be.calledWith(sinon.match({ message: error.message }))
      expect(this.next).to.have.been.calledOnce
    })
  })

  describe('#getDetails', () => {
    context('when called with a contact', () => {
      beforeEach(() => {
        this.res.locals = assign({}, this.res.locals, { contact })
        this.contactController.getDetails(this.req, this.res, this.next)
      })

      it('should return the contact details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options).to.have.property('contactDetails')
      })

      it('should call the details transformer', () => {
        expect(this.transformerStub).to.be.calledWith(contact)
      })

      it('should render the contact details view', () => {
        expect(this.res.render).to.be.calledWith('contacts/views/details')
      })
    })
  })
})
