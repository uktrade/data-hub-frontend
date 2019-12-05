const proxyquire = require('proxyquire')

const contactData = { company: { name: 'company' } }

describe('Contacts interactions middleware', () => {
  beforeEach(() => {
    this.getContactStub = sinon.stub().returns(contactData)
    this.middleware = proxyquire('../interactions', {
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
    this.nextSpy = sinon.spy()
  })

  describe('#setInteractionsDetails', () => {
    beforeEach(() => {
      this.middleware.setInteractionsDetails(this.req, this.res, this.nextSpy)
    })

    it('should set the return URL', () => {
      expect(this.res.locals.interactions.returnLink).to.equal('/contacts/1/interactions/')
    })

    it('should set the entity name', () => {
      expect(this.res.locals.interactions.entityName).to.equal('first last')
    })

    it('should set the interactions query', () => {
      expect(this.res.locals.interactions.query).to.deep.equal({ contacts__id: '1' })
    })

    it('should allow interactions to be added', () => {
      expect(this.res.locals.interactions.canAdd).to.be.true
    })
  })

  describe('#setCompanyDetails', () => {
    it('should set the entiity name', async () => {
      await this.middleware.setCompanyDetails(this.req, this.res, this.nextSpy)
      expect(this.res.locals.company).to.deep.equal(contactData.company)
    })
  })
})
