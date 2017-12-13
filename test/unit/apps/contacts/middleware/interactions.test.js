const contactData = { company: { name: 'company' } }

describe('Contacts interactions middleware', () => {
  beforeEach(() => {
    this.getContactStub = sandbox.stub().returns(contactData)
    this.middleware = proxyquire('~/src/apps/contacts/middleware/interactions', {
      '../../contacts/repos': {
        getContact: this.getContactStub,
      },
    })
    this.req = {
      params: {
        contactId: '1',
      },
      session: {
        token: 'abcd',
      },
    }
    this.res = {
      locals: {
        contact: {
          first_name: 'first',
          last_name: 'last',
        },
      },
    }
    this.nextSpy = sandbox.spy()
  })

  describe('#setInteractionsReturnUrl', () => {
    it('should set the return URL', () => {
      this.middleware.setInteractionsReturnUrl(this.req, this.res, this.nextSpy)
      expect(this.res.locals.returnLink).to.equal('/contacts/1/interactions/')
    })
  })

  describe('#setInteractionsEntityName', () => {
    it('should set the entity name', () => {
      this.middleware.setInteractionsEntityName(this.req, this.res, this.nextSpy)
      expect(this.res.locals.entityName).to.equal('first last')
    })
  })

  describe('#setCompanyDetails', () => {
    it('should set the entity name', async () => {
      await this.middleware.setCompanyDetails(this.req, this.res, this.nextSpy)
      expect(this.res.locals.company).to.deep.equal(contactData.company)
    })
  })
})
