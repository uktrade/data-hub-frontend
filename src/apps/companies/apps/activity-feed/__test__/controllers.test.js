const activityFeedEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-from-es.json')
const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/company.json')
const { FILTER_ITEMS, FILTER_KEYS, ES_KEYS_GROUPED } = require('../constants')
const { companies } = require('../../../../../lib/urls')

describe('Activity feed controllers', () => {
  let fetchActivityFeedStub, getGlobalUltimateHierarchyStub, controllers, middlewareParameters
  describe('#fetchActivityFeedHandler', () => {
    before(() => {
      fetchActivityFeedStub = sinon.stub().resolves(activityFeedEsFixtures)
      getGlobalUltimateHierarchyStub = sinon.stub().resolves({ results: [{ id: '123' }, { id: '456' }] })

      controllers = proxyquire('../../src/apps/companies/apps/activity-feed/controllers', {
        './repos': {
          fetchActivityFeed: fetchActivityFeedStub,
        },
        '../../repos': {
          getGlobalUltimateHierarchy: getGlobalUltimateHierarchyStub,
        },
      })
    })

    const commonTests = (types, attributedTo) => {
      expect(fetchActivityFeedStub).to.be.calledWith({
        token: '1234',
        from: 0,
        size: 20,
        filter: [
          {
            terms: {
              'object.type': types,
            },
          },
          {
            terms: {
              'object.attributedTo.id': attributedTo,
            },
          },
        ],
      })
      expect(middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
    }

    context('when fetching activity (no filter) for a company', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with default params', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        commonTests(dataHubActivity, ['dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'])
      })
    })

    context('when filtering on "All activity" for a company', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            activityTypeFilter: 'allActivity',
            showDnbHierarchy: false,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { allActivity } = ES_KEYS_GROUPED
        commonTests(allActivity, ['dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'])
      })
    })

    context('when filtering on "My activity" for a company', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            activityTypeFilter: 'myActivity',
            showDnbHierarchy: false,
          },
          user: {
            id: 123,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with a user id', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        commonTests(dataHubActivity, [
          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a',
          'dit:DataHubAdviser:123',
        ])
      })
    })

    context('when filtering on "Data Hub activity" for a company', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            activityTypeFilter: 'dataHubActivity',
            showDnbHierarchy: false,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        commonTests(dataHubActivity, ['dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'])
      })
    })

    context('when filtering on "External activity"', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            activityTypeFilter: 'externalActivity',
            showDnbHierarchy: false,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { externalActivity } = ES_KEYS_GROUPED
        commonTests(externalActivity, ['dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'])
      })
    })

    context('when applying both Data Hub activity and Ultimate HQ subsidaries filters', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            is_global_ultimate: true,
          },
          requestQuery: {
            activityTypeFilter: 'dataHubActivity',
            showDnbHierarchy: true,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        commonTests(dataHubActivity, [
          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a',
          'dit:DataHubCompany:123',
          'dit:DataHubCompany:456',
        ])
      })
    })

    context('when filtering param is invalid', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            activityTypeFilter: 'foobar',
            showDnbHierarchy: false,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        commonTests(dataHubActivity, ['dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'])
      })
    })

    context('when the endpoint returns error', () => {
      let error = {
        status: 404,
      }

      before(async () => {
        fetchActivityFeedStub.rejects(error)
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should call next with an error', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        const expectedParams = {
          token: '1234',
          from: 0,
          size: 20,
          filter: [
            {
              terms: {
                'object.type': dataHubActivity,
              },
            },
            {
              terms: {
                'object.attributedTo.id': [
                  'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a',
                ],
              },
            },
          ],
        }

        expect(fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(middlewareParameters.resMock.json).to.not.have.been.called
        expect(middlewareParameters.nextSpy).to.have.been.calledWith(error)
      })
    })
  })

  describe('#renderActivityFeed', () => {
    context('when the feed renders successfully', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          user: {
            id: 123,
          },
        })

        await controllers.renderActivityFeed(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should render', () => {
        expect(middlewareParameters.resMock.render).to.be.calledOnce
      })

      it('should render the activity feed template', () => {
        const companyId = middlewareParameters.resMock.locals.company.id
        expect(middlewareParameters.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/activity-feed/views/client-container', {
            props: {
              contentLink: companies.interactions.create(companyId),
              contentText: 'Add interaction',
              activityTypeFilter: FILTER_KEYS.dataHubActivity,
              activityTypeFilters: FILTER_ITEMS,
              apiEndpoint: companies.activity.data(companyId),
              isGlobalUltimate: false,
              isTypeFilterFlagEnabled: undefined,
              isGlobalUltimateFlagEnabled: undefined,
            },
          })
      })

      it('should add a breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb.firstCall).to.be.calledWith(
          'Wonka Industries',
          companies.detail('dcdabbc9-1781-e411-8955-e4115bead28a')
        )
        expect(middlewareParameters.resMock.breadcrumb.lastCall).to.be.calledWith('Activity Feed')
      })

      it('should not call "next" with an error', async () => {
        expect(middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when viewing the Ulitmate HQ block', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            is_global_ultimate: true,
          },
        })

        await controllers.renderActivityFeed(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should set both the "DnB Hierarchy" and "DnB Subsidiary" counts', () => {
        const companyId = 'dcdabbc9-1781-e411-8955-e4115bead28a'
        expect(middlewareParameters.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/activity-feed/views/client-container', {
            props: {
              contentLink: companies.interactions.create(companyId),
              contentText: 'Add interaction',
              activityTypeFilter: FILTER_KEYS.dataHubActivity,
              activityTypeFilters: FILTER_ITEMS,
              apiEndpoint: companies.activity.data(companyId),
              isGlobalUltimate: true,
              dnbHierarchyCount: 2,
              dnbSubsidiaryCount: 1,
              isTypeFilterFlagEnabled: undefined,
              isGlobalUltimateFlagEnabled: undefined,
            },
          })
      })
    })

    context('when viewing the feed for archived company', () => {
      let middlewareParameters = null
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived: true,
          },
          user: {
            id: 123,
          },
        })

        await controllers.renderActivityFeed(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should render the template without the "Add interaction" button', () => {
        const expectedParams = {
          props: {
            apiEndpoint: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/activity/data',
          },
        }

        expect(middlewareParameters.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/activity-feed/views/client-container', expectedParams)
      })
    })

    context('when the rendering fails', () => {
      before(async () => {
        middlewareParameters.resMock.render.throws()

        await controllers.renderActivityFeed(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should not call render', () => {
        expect(middlewareParameters.resMock.render).to.be.thrown
      })

      it('should call next in the catch', () => {
        expect(middlewareParameters.nextSpy).to.be.calledOnce
      })
    })
  })
})
