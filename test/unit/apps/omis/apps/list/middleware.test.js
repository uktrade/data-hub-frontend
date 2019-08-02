const { assign } = require('lodash')

describe('OMIS list middleware', () => {
  beforeEach(() => {
    this.next = sinon.spy()
    this.req = assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = assign({}, globalRes)

    this.controller = require('src/apps/omis/apps/list/middleware')
  })

  describe('#setRequestBody', () => {
    it('should not set req.body for empty query', async () => {
      await this.controller.setRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })

    it('should set req.body for valid query items', async () => {
      this.req.query = {
        status: 'draft',
        company_name: 'samsung',
        sortby: 'name:asc',
        random: 'query',
      }

      await this.controller.setRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.deep.equal({
        status: 'draft',
        company_name: 'samsung',
        sortby: 'name:asc',
      })
      expect(this.next).to.have.been.calledOnce
    })

    it('should not set req.body invalid items', async () => {
      this.req.query = {
        random: 'query',
        some: 'more',
      }

      await this.controller.setRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })

    context('when a currency field is searched on', () => {
      it('should transform value to pence', async () => {
        this.req.query = {
          random: 'query',
          total_cost: '10.00',
        }

        await this.controller.setRequestBody(this.req, this.res, this.next)

        expect(this.req.body).to.deep.equal({
          total_cost: 1000,
        })
        expect(this.next).to.have.been.calledOnce
      })
    })
  })
})
