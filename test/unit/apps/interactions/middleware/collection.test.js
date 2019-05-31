const { assign, times } = require('lodash')

const interactions = require('../../../data/interactions/attendees')

describe('interaction collection middleware', () => {
  beforeEach(async () => {
    this.req = {
      body: {},
      session: {
        token: '1234',
      },
      params: {},
      query: {
        page: '2',
      },
    }

    this.res = {
      locals: {
        userAgent: {
          isIE: false,
        },
      },
    }

    this.next = sinon.spy()
    this.getInteractionsForEntityStub = sinon.stub()

    this.middleware = proxyquire('~/src/apps/interactions/middleware/collection', {
      '../repos': {
        getInteractionsForEntity: this.getInteractionsForEntityStub.resolves({
          count: 20,
          limit: 10,
          results: times(10, interactions.results[0]),
        }),
      },
    })
  })

  describe('#getInteractionCollectionForEntity', () => {
    const commonTests = () => {
      it('should get the interactions for the entity once', () => {
        expect(this.getInteractionsForEntityStub).to.have.been.calledOnce
      })

      it('should set the results', () => {
        expect(this.res.locals.results.items.length).to.equal(10)
      })
    }

    context('when a sort by is specified', () => {
      beforeEach(async () => {
        this.req = {
          ...this.req,
          query: {
            ...this.req.query,
            sortby: 'company__name',
          },
        }

        this.res = {
          ...this.res,
          locals: {
            ...this.res.locals,
            interactions: {
              entityQuery: {
                entity: '1',
              },
            },
          },
        }

        await this.middleware.getInteractionCollectionForEntity(this.req, this.res, this.next)
      })

      commonTests()

      it('should use the specified sort', () => {
        const actual = this.getInteractionsForEntityStub.getCall(0).args[0].sortby
        expect(actual).to.equal('company__name')
      })

      it('should set the pagination', () => {
        expect(this.res.locals.results.pagination).to.deep.equal({
          currentPage: 2,
          next: null,
          pages: [
            {
              label: 1,
              url: '?page=1&sortby=company__name',
            },
            {
              label: 2,
              url: '?page=2&sortby=company__name',
            },
          ],
          prev: '?page=1&sortby=company__name',
          totalPages: 2,
        })
      })
    })

    context('when a sort by is not specified', () => {
      beforeEach(async () => {
        this.req = {
          ...this.req,
          query: {
            ...this.req.query,
          },
        }

        this.res = {
          ...this.res,
          locals: {
            ...this.res.locals,
            interactions: {
              entityQuery: {
                entity: '1',
              },
            },
          },
        }

        await this.middleware.getInteractionCollectionForEntity(this.req, this.res, this.next)
      })

      commonTests()

      it('should use the default sort', () => {
        const actual = this.getInteractionsForEntityStub.getCall(0).args[0].sortby
        expect(actual).to.equal('-date')
      })

      it('should set the pagination', () => {
        expect(this.res.locals.results.pagination).to.deep.equal({
          currentPage: 2,
          next: null,
          pages: [
            {
              label: 1,
              url: '?page=1',
            },
            {
              label: 2,
              url: '?page=2',
            },
          ],
          prev: '?page=1',
          totalPages: 2,
        })
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        this.req = {
          ...this.req,
          query: {
            ...this.req.query,
          },
        }

        this.res = {
          ...this.res,
          locals: {
            ...this.res.locals,
            interactions: {
              entityQuery: {
                entity: '1',
              },
            },
          },
        }

        this.error = new Error('error')

        this.middleware = proxyquire('~/src/apps/interactions/middleware/collection', {
          '../repos': {
            getInteractionsForEntity: this.getInteractionsForEntityStub.rejects(this.error),
          },
        })

        await this.middleware.getInteractionCollectionForEntity(this.req, this.res, this.next)
      })

      it('should call next once with an error', () => {
        expect(this.next.args[0][0].message).to.have.string('error')
      })
    })
  })

  describe('#getInteractionsRequestBody', () => {
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
          dit_participants__adviser: '4321',
          dit_participants__team: '4321',
          date_after: '2017-02-01',
          date_before: '2018-01-01',
          fruit: 'Orange',
        })

        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should put the criteria in the request body', () => {
        expect(this.req.body.kind).to.equal(this.req.query.kind)
        expect(this.req.body.communication_channel).to.equal(this.req.query.communication_channel)
        expect(this.req.body.dit_participants__adviser).to.equal(this.req.query.dit_participants__adviser)
        expect(this.req.body.dit_participants__team).to.equal(this.req.query.dit_participants__team)
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
    const commonTests = () => {
      it('should generate a sort form', () => {
        expect(this.res.locals).to.have.property('sortForm')
      })
    }

    context('when called with no sort order', () => {
      beforeEach(() => {
        this.middleware.getInteractionSortForm(this.req, this.res, this.next)
      })

      commonTests()
    })

    context('when called with a sort order', () => {
      beforeEach(() => {
        this.req = {
          ...this.req,
          query: {
            ...this.req.query,
            sortby: 'name',
          },
        }

        this.middleware.getInteractionSortForm(this.req, this.res, this.next)
      })

      commonTests()

      it('should indicate the selected sort order', () => {
        expect(this.res.locals.sortForm.children[0].value).to.equal('name')
      })
    })
  })
})
