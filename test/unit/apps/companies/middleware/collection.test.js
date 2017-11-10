const nock = require('nock')
const config = require('~/config')
const { getRequestBody, getCompanyCollection } = require('~/src/apps/companies/middleware/collection')

describe('Company collection middleware', () => {
  beforeEach(() => {
    nock(config.apiRoot)
      .post(`/v3/search/company`)
      .reply(200, {
        count: 3,
        results: [
          {
            id: '111',
            name: 'A',
          },
          {
            id: '222',
            name: 'B',
          },
          {
            id: '333',
            name: 'C',
          },
        ],
      })

    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.req = Object.assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = {
      locals: {},
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getCompanyCollection', () => {
    beforeEach(async () => {
      this.req.query = {
        stage: 'i1',
        sector: 's1',
        sortby: 'name:asc',
      }
      await getCompanyCollection(this.req, this.res, this.next)
    })

    it('should set results property on locals with pagination', () => {
      const actual = this.res.locals.results
      expect(actual).to.have.property('count')
      expect(actual).to.have.property('items').to.have.length(3)
      expect(actual).to.have.property('pagination')
      expect(actual.count).to.equal(3)
      expect(this.next).to.have.been.calledOnce
    })
  })

  describe('#getRequestBody', () => {
    it('should not set req.body for empty query', () => {
      getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })

    it('should set req.body for valid query items', () => {
      this.req.query = {
        sector: 'space',
        uk_region: 'london',
        sortby: 'name:asc',
        random: 'query',
      }

      getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.deep.equal({
        sector: 'space',
        uk_region: 'london',
        sortby: 'name:asc',
      })
      expect(this.next).to.have.been.calledOnce
    })

    it('should not set req.body invalid items', async () => {
      this.req.query = {
        random: 'query',
        some: 'more',
      }

      getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })
  })
})
