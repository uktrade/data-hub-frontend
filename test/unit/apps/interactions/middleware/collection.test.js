const { assign } = require('lodash')

describe('interaction collection middleware', () => {
  beforeEach(async () => {
    this.req = {
      body: {},
      session: {
        token: '1234',
      },
      params: {},
      query: {
        page: '1',
      },
    }

    this.res = {
      locals: {
        returnLink: '/return',
      },
    }

    this.next = sinon.spy()
  })

  describe('#getInteractionsRequestBody', () => {
    beforeEach(() => {
      this.middleware = require('~/src/apps/interactions/middleware/collection')
    })

    context('when called with contact id', () => {
      beforeEach(() => {
        this.req.params.contactId = '1234'
        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should set the contact in the request body', () => {
        expect(this.req.body.contact).to.equal('1234')
      })
    })

    context('when called with company id', () => {
      beforeEach(() => {
        this.req.params.companyId = '1234'
        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should set the contact in the request body', () => {
        expect(this.req.body.company).to.equal('1234')
      })
    })

    context('when called with sort order', () => {
      beforeEach(() => {
        this.req.query.sortby = 'name'
        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should set the sort order in the request body', () => {
        expect(this.req.body.sortby).to.equal('name')
      })
    })

    context('when called with filter criteria', () => {
      beforeEach(() => {
        this.req.query = assign({}, this.req.query, {
          kind: 'interaction',
          communication_channel: 'phone',
          dit_adviser: '4321',
          date_after: '2017-02-01',
          date_before: '2018-01-01',
          fruit: 'Orange',
        })

        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should put the criteria in the request body', () => {
        expect(this.req.body.kind).to.equal(this.req.query.kind)
        expect(this.req.body.communication_channel).to.equal(this.req.query.communication_channel)
        expect(this.req.body.dit_adviser).to.equal(this.req.query.dit_adviser)
        expect(this.req.body.date_after).to.equal(this.req.query.date_after)
        expect(this.req.body.date_before).to.equal(this.req.query.date_before)
      })

      it('should not include invalid parameters', () => {
        expect(this.req.body).to.not.have.property('fruit')
      })
    })

    context('when called clear filters', () => {
      beforeEach(() => {
        this.req.query = assign({}, this.req.query, {
          sortby: 'date:desc',
          date_after: '',
          date_before: '',
        })

        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should put the default criteria in the request body', () => {
        expect(this.req.body.sortby).to.equal(this.req.query.sortby)
      })

      it('should not include empty parameters', () => {
        expect(this.req.body).to.not.have.property('date_after')
        expect(this.req.body).to.not.have.property('date_before')
      })
    })
  })

  describe('#getInteractionSortForm', () => {
    beforeEach(() => {
      this.middleware = require('~/src/apps/interactions/middleware/collection')
    })

    context('when called with no sort order', () => {
      beforeEach(() => {
        this.middleware.getInteractionSortForm(this.req, this.res, this.next)
      })

      it('should generate a sort form', () => {
        expect(this.res.locals).to.have.property('sortForm')
      })
    })

    context('when called with a sort order', () => {
      beforeEach(() => {
        this.req.query.sortby = 'name'
        this.middleware.getInteractionSortForm(this.req, this.res, this.next)
      })

      it('should generate a sort form', () => {
        expect(this.res.locals).to.have.property('sortForm')
      })

      it('should indicate the selected sort order', () => {
        expect(this.res.locals.sortForm.children[0].value).to.equal('name')
      })
    })
  })
})
