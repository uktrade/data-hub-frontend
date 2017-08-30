describe('Contact controller', () => {
  const { contactDetailsLabels } = require('~/src/apps/contacts/labels')

  const createContactController = (getContact, getDisplayContact, getDitCompany, buildCompanyUrl) => {
    return proxyquire('~/src/apps/contacts/controllers/details', {
      '../repos': {
        getContact: getContact,
      },
      '../services/formatting': {
        getDisplayContact: getDisplayContact,
      },
      '../../companies/repos': {
        getDitCompany: getDitCompany,
      },
      '../../companies/services/data': {
        buildCompanyUrl: buildCompanyUrl,
      },
    })
  }

  beforeEach(() => {
    const contact = require('../../../data/simple-contact')
    const companyUrl = `/companies/${contact.company.id}`
    const contactDetails = { id: contact.id, name: contact.first_name.toLowerCase() }

    const getContactStub = sinon.stub().resolves(contact)
    const getDisplayContactStub = sinon.stub().returns(contactDetails)
    const getDitCompanyStub = sinon.stub().resolves(contact.company)
    const buildCompanyUrlStub = sinon.stub().returns(companyUrl)

    this.sandbox = sinon.sandbox.create()

    this.contactController = createContactController(
      getContactStub,
      getDisplayContactStub,
      getDitCompanyStub,
      buildCompanyUrlStub
    )

    this.companyUrl = companyUrl
    this.contactDetails = contactDetails

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
      breadcrumb () { return this },
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

    it('should get the company URL', async () => {
      await this.contactController.getCommon(this.req, this.res, this.next)

      expect(this.res.locals.companyUrl).to.equal(this.companyUrl)
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
      const contactController = createContactController(
        sinon.stub().rejects(error),
        sinon.stub().rejects(error),
        sinon.stub().rejects(error),
        sinon.stub().rejects(error)
      )

      await contactController.getCommon(this.req, this.res, this.next)

      expect(this.next).to.be.calledWith(sinon.match({ message: error.message }))
      expect(this.next).to.have.been.calledOnce
    })
  })

  describe('#getDetails', () => {
    it('should get the tab', () => {
      this.contactController.getDetails(this.req, this.res, this.next)

      expect(this.res.locals.tab).to.equal('details')
    })

    it('should get the contact details', () => {
      this.contactController.getDetails(this.req, this.res, this.next)

      expect(this.res.locals.contactDetails).to.deep.equal(this.contactDetails)
    })

    it('should get the contact details labels', () => {
      this.contactController.getDetails(this.req, this.res, this.next)

      expect(this.res.locals.contactDetailsLabels).to.deep.equal(contactDetailsLabels)
    })

    it('should get the contact details display order', () => {
      this.contactController.getDetails(this.req, this.res, this.next)

      expect(this.res.locals.contactDetailsDisplayOrder).to.deep.equal([ 'id', 'name' ])
    })

    it('should render the contact details view', () => {
      this.contactController.getDetails(this.req, this.res, this.next)

      expect(this.res.render).to.be.calledWith('contacts/views/details')
    })
  })
})
