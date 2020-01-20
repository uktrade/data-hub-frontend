const proxyquire = require('proxyquire')

const contactData = { company: { name: 'company' } }

describe('Contacts interactions middleware', () => {
  let middleware
  let req
  let res
  let next
  beforeEach(() => {
    const getContactStub = sinon.stub().returns(contactData)
    middleware = proxyquire('../interactions', {
      '../../contacts/repos': { getContact: getContactStub },
    })
    req = {
      params: {
        contactId: '1',
      },
      session: {
        token: 'abcd',
      },
    }
    res = {
      locals: {
        contact: {
          first_name: 'first',
          last_name: 'last',
        },
      },
    }
    next = sinon.spy()
  })

  describe('#setInteractionsDetails', () => {
    beforeEach(() => {
      middleware.setInteractionsDetails(req, res, next)
    })

    it('should set the return URL', () => {
      expect(res.locals.interactions.returnLink).to.equal(
        '/contacts/1/interactions/'
      )
    })

    it('should set the entity name', () => {
      expect(res.locals.interactions.entityName).to.equal('first last')
    })

    it('should set the interactions query', () => {
      expect(res.locals.interactions.query).to.deep.equal({
        contacts__id: '1',
      })
    })

    it('should allow interactions to be added', () => {
      expect(res.locals.interactions.canAdd).to.be.true
    })
  })

  describe('#setCompanyDetails', () => {
    it('should set the entiity name', async () => {
      await middleware.setCompanyDetails(req, res, next)
      expect(res.locals.company).to.deep.equal(contactData.company)
    })
  })
})
