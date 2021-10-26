const { assign, times } = require('lodash')
const proxyquire = require('proxyquire')

const interactions = require('../../../../../test/unit/data/interactions/attendees.json')

describe('interaction collection middleware', () => {
  let req, res, next
  let getInteractionsForEntityStub
  let middleware

  beforeEach(async () => {
    req = {
      body: {},
      session: {
        token: '1234',
      },
      params: {},
      query: {
        page: '2',
      },
    }

    next = sinon.spy()
    getInteractionsForEntityStub = sinon.stub()

    middleware = proxyquire('../collection', {
      '../repos': {
        getInteractionsForEntity: getInteractionsForEntityStub.resolves({
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
        expect(getInteractionsForEntityStub).to.have.been.calledOnce
      })

      it('should set the results', () => {
        expect(res.locals.results.items.length).to.equal(10)
      })
    }

    context('when a sort by is specified', () => {
      beforeEach(async () => {
        req = {
          ...req,
          query: {
            ...req.query,
            sortby: 'company__name',
          },
        }

        res = {
          ...res,
          locals: {
            interactions: {
              entityQuery: {
                entity: '1',
              },
            },
          },
        }

        await middleware.getInteractionCollectionForEntity(req, res, next)
      })

      commonTests()

      it('should use the specified sort', () => {
        const actual = getInteractionsForEntityStub.getCall(0).args[0].sortby
        expect(actual).to.equal('company__name')
      })

      it('should set the pagination', () => {
        expect(res.locals.results.pagination).to.deep.equal({
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
        req = {
          ...req,
          query: {
            ...req.query,
          },
        }

        res = {
          ...res,
          locals: {
            interactions: {
              entityQuery: {
                entity: '1',
              },
            },
          },
        }

        await middleware.getInteractionCollectionForEntity(req, res, next)
      })

      commonTests()

      it('should use the default sort', () => {
        const actual = getInteractionsForEntityStub.getCall(0).args[0].sortby
        expect(actual).to.equal('-date')
      })

      it('should set the pagination', () => {
        expect(res.locals.results.pagination).to.deep.equal({
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
      let error

      beforeEach(async () => {
        req = {
          ...req,
          query: {
            ...req.query,
          },
        }

        res = {
          ...res,
          locals: {
            interactions: {
              entityQuery: {
                entity: '1',
              },
            },
          },
        }

        error = new Error('error')

        middleware = proxyquire('../collection', {
          '../repos': {
            getInteractionsForEntity:
              getInteractionsForEntityStub.rejects(error),
          },
        })

        await middleware.getInteractionCollectionForEntity(req, res, next)
      })

      it('should call next once with an error', () => {
        expect(next.args[0][0].message).to.have.string('error')
      })
    })
  })

  describe('#getInteractionsRequestBody', () => {
    context('when called with sort order', () => {
      beforeEach(() => {
        req.query.sortby = 'name'

        middleware.getInteractionsRequestBody(req, res, next)
      })

      it('should set the sort order in the request body', () => {
        expect(req.body.sortby).to.equal('name')
      })
    })

    context('when called with filter criteria', () => {
      beforeEach(() => {
        req.query = assign({}, req.query, {
          kind: 'interaction',
          communication_channel: 'phone',
          dit_participants__adviser: '4321',
          dit_participants__team: '4321',
          date_after: '2017-02-01',
          date_before: '2018-01-01',
          fruit: 'Orange',
        })

        middleware.getInteractionsRequestBody(req, res, next)
      })

      it('should put the criteria in the request body', () => {
        expect(req.body.kind).to.equal(req.query.kind)
        expect(req.body.communication_channel).to.equal(
          req.query.communication_channel
        )
        expect(req.body.dit_participants__adviser).to.equal(
          req.query.dit_participants__adviser
        )
        expect(req.body.dit_participants__team).to.equal(
          req.query.dit_participants__team
        )
        expect(req.body.date_after).to.equal(req.query.date_after)
        expect(req.body.date_before).to.equal(req.query.date_before)
      })

      it('should not include invalid parameters', () => {
        expect(req.body).to.not.have.property('fruit')
      })
    })

    context('when called clear filters', () => {
      beforeEach(() => {
        req.query = assign({}, req.query, {
          sortby: 'date:desc',
          date_after: '',
          date_before: '',
        })

        middleware.getInteractionsRequestBody(req, res, next)
      })

      it('should put the default criteria in the request body', () => {
        expect(req.body.sortby).to.equal(req.query.sortby)
      })

      it('should not include empty parameters', () => {
        expect(req.body).to.not.have.property('date_after')
        expect(req.body).to.not.have.property('date_before')
      })
    })
  })

  describe('#getInteractionSortForm', () => {
    const commonTests = () => {
      it('should generate a sort form', () => {
        expect(res.locals).to.have.property('sortForm')
      })
    }

    context('when called with no sort order', () => {
      beforeEach(() => {
        middleware.getInteractionSortForm(req, res, next)
      })

      commonTests()
    })

    context('when called with a sort order', () => {
      beforeEach(() => {
        req = {
          ...req,
          query: {
            ...req.query,
            sortby: 'name',
          },
        }

        middleware.getInteractionSortForm(req, res, next)
      })

      commonTests()

      it('should indicate the selected sort order', () => {
        expect(res.locals.sortForm.children[0].value).to.equal('name')
      })
    })
  })
})
