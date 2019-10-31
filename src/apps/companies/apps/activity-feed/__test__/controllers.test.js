const activityFeedEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-from-es.json')
const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/company.json')
const { ACTIVITY_TYPE_FILTER_KEYS } = require('../../../constants')
const { ACTIVITY_TYPE_FILTERS } = require('../../../constants')
const { companies } = require('../../../../../lib/urls')
const config = require('../../../../../config')

describe('Activity feed controllers', () => {
  describe('#fetchActivityFeedHandler', () => {
    beforeEach(() => {
      global.fetchActivityFeedStub = sinon.stub().resolves(activityFeedEsFixtures)
      global.controllers = proxyquire('../../src/apps/companies/apps/activity-feed/controllers', {
        './repos': {
          fetchActivityFeed: global.fetchActivityFeedStub,
        },
      })
    })

    context('when fetching feed for a company', () => {
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await global.controllers.fetchActivityFeedHandler(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with default params', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: {
            terms: {
              'object.type': config.activityFeed.supportedActivityTypes,
            },
          },
          from: 0,
          token: '1234',
        }

        expect(global.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(global.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering for "all" activity feed for a company', () => {
      const { allActivity } = ACTIVITY_TYPE_FILTER_KEYS
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'all',
          },
        })

        await global.controllers.fetchActivityFeedHandler(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedParams = { companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a', filter: { 'terms': { 'object.type': allActivity } }, from: 0, token: '1234' }

        expect(global.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(global.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering for "my" activity feed for a company', () => {
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'my-activity',
          },
          user: {
            id: 123,
          },
        })

        await global.controllers.fetchActivityFeedHandler(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with "my" user id', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: { 'terms': { 'object.attributedTo.id': ['dit:DataHubAdviser:123'] } },
          from: 0,
          token: '1234',
        }

        expect(global.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(global.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering for "data-hub activity" activity feed for a company', () => {
      const { dataHubActivity } = ACTIVITY_TYPE_FILTER_KEYS
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'datahub-activity',
          },
        })

        await global.controllers.fetchActivityFeedHandler(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: { 'terms': { 'object.type': dataHubActivity } },
          from: 0,
          token: '1234',
        }

        expect(global.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(global.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering for "external activity" activity feed for a company', () => {
      const { externalActivity } = ACTIVITY_TYPE_FILTER_KEYS
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'external-activity',
          },
        })

        await global.controllers.fetchActivityFeedHandler(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: { 'terms': { 'object.type': externalActivity } },
          from: 0,
          token: '1234',
        }

        expect(global.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(global.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering param is invalid', () => {
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'foobar',
          },
        })

        await global.controllers.fetchActivityFeedHandler(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: { 'terms': { 'object.type': config.activityFeed.supportedActivityTypes } },
          from: 0,
          token: '1234',
        }

        expect(global.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(global.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when the endpoint returns error', () => {
      beforeEach(async () => {
        global.error = {
          statusCode: 404,
        }
        global.fetchActivityFeedStub.rejects(global.error)

        global.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await global.controllers.fetchActivityFeedHandler(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call next with an error', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: {
            terms: {
              'object.type': config.activityFeed.supportedActivityTypes,
            },
          },
          from: 0,
          token: '1234',
        }

        expect(global.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(global.middlewareParameters.resMock.json).to.not.have.been.called
        expect(global.middlewareParameters.nextSpy).to.have.been.calledWith(global.error)
      })
    })
  })

  describe('#renderActivityFeed', () => {
    context('when the feed renders successfully', () => {
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
          },
          user: {
            id: 123,
          },
        })

        await global.controllers.renderActivityFeed(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should render', () => {
        expect(global.middlewareParameters.resMock.render).to.be.calledOnce
      })

      it('should render the activity feed template', () => {
        const companyId = global.middlewareParameters.resMock.locals.company.id
        expect(global.middlewareParameters.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/activity-feed/views/client-container', {
            props: {
              addActivityTypeFilter: {
                ...ACTIVITY_TYPE_FILTERS,
              },
              addContentLink: companies.interactions.create(companyId),
              addContentText: 'Add interaction',
              apiEndpoint: companies.activity.data(companyId),
              isTypeFilterEnabled: undefined,
            },
          })
      })

      it('should add a breadcrumb', () => {
        expect(global.middlewareParameters.resMock.breadcrumb.firstCall).to.be.calledWith(
          'Wonka Industries',
          '/companies/dcdabbc9-1781-e411-8955-e4115bead28a'
        )
        expect(global.middlewareParameters.resMock.breadcrumb.lastCall).to.be.calledWith('Activity Feed')
      })

      it('should not call "next" with an error', async () => {
        expect(global.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when viewing the Ulitmate HQ block', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/company?limit=200&global_ultimate_duns_number=123456789`)
          .reply(200, { results: [{}, {}, {}] })

        global.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            is_global_ultimate: true,
          },
        })

        await global.controllers.renderActivityFeed(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should make an API call to get the Ultimate HQ subsidiary count', () => {
        const companyId = global.middlewareParameters.resMock.locals.company.id
        expect(global.middlewareParameters.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/activity-feed/views/client-container', {
            props: {
              addActivityTypeFilter: {
                ...ACTIVITY_TYPE_FILTERS,
              },
              addContentLink: companies.interactions.create(companyId),
              addContentText: 'Add interaction',
              apiEndpoint: companies.activity.data(companyId),
              isTypeFilterEnabled: undefined,
              subsidiaryCount: 2,
            },
          })
      })
    })

    context('when viewing the feed for archived company', () => {
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived: true,
          },
          user: {
            id: 123,
          },
        })

        await global.controllers.renderActivityFeed(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should render the template without the "Add interaction" button', () => {
        expect(global.middlewareParameters.resMock.render).to.be.calledOnceWithExactly('companies/apps/activity-feed/views/client-container', {
          props: {
            apiEndpoint: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/activity/data',
          },
        })
      })
    })

    context('when the rendering fails', () => {
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          user: {
            id: 123,
          },
        })

        global.error = new Error('Could not render')

        const errorRes = {
          ...global.middlewareParameters.resMock,
          render: () => { throw global.error },
        }

        await global.controllers.renderActivityFeed(
          global.middlewareParameters.reqMock,
          errorRes,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call next with an error', async () => {
        expect(global.middlewareParameters.nextSpy).to.have.been.calledWith(global.error)
      })
    })
  })
})
