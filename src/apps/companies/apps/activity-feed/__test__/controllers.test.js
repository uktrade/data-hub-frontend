const activityFeedEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-from-es.json')
const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/company.json')
const { ES_KEYS_GROUPED } = require('../constants')

describe('Activity feed controllers', () => {
  let fetchActivityFeedStub,
    getGlobalUltimateHierarchyStub,
    controllers,
    middlewareParameters
  describe('#fetchActivityFeedHandler', () => {
    before(() => {
      fetchActivityFeedStub = sinon.stub().resolves(activityFeedEsFixtures)
      getGlobalUltimateHierarchyStub = sinon
        .stub()
        .resolves({ results: [{ id: '123' }, { id: '456' }] })

      controllers = proxyquire(
        '../../src/apps/companies/apps/activity-feed/controllers',
        {
          './repos': {
            fetchActivityFeed: fetchActivityFeedStub,
          },
          '../../repos': {
            getGlobalUltimateHierarchy: getGlobalUltimateHierarchyStub,
          },
        }
      )
    })

    const commonTests = (types, attributedTo) => {
      const expectedEsQuery = {
        from: 0,
        size: 20,
        sort: [
          {
            'object.startTime': {
              order: 'desc',
            },
          },
        ],
        query: {
          bool: {
            filter: {
              bool: {
                must: [
                  {
                    terms: {
                      'object.type': types,
                    },
                  },
                  {
                    term: {
                      'object.attributedTo.id': attributedTo,
                    },
                  },
                ],
              },
            },
          },
        },
      }
      expect(fetchActivityFeedStub).to.be.calledWith(
        middlewareParameters.reqMock,
        expectedEsQuery
      )

      expect(middlewareParameters.resMock.json).to.be.calledOnceWithExactly(
        activityFeedEsFixtures
      )
    }

    context('when fetching activity (no filter) for a company', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchActivityFeed with default params', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        commonTests(
          dataHubActivity,
          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'
        )
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
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { allActivity } = ES_KEYS_GROUPED
        commonTests(
          allActivity,
          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'
        )
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
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchActivityFeed with a user id', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        const expectedEsQuery = {
          from: 0,
          size: 20,
          sort: [
            {
              'object.startTime': {
                order: 'desc',
              },
            },
          ],
          query: {
            bool: {
              filter: {
                bool: {
                  must: [
                    {
                      terms: {
                        'object.type': dataHubActivity,
                      },
                    },
                    {
                      term: {
                        'object.attributedTo.id': 'dit:DataHubAdviser:123',
                      },
                    },
                    {
                      term: {
                        'object.attributedTo.id':
                          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a',
                      },
                    },
                  ],
                },
              },
            },
          },
        }
        expect(fetchActivityFeedStub).to.be.calledWith(
          middlewareParameters.reqMock,
          expectedEsQuery
        )
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
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        commonTests(
          dataHubActivity,
          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'
        )
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
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { externalActivity } = ES_KEYS_GROUPED
        commonTests(
          externalActivity,
          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'
        )
      })
    })

    context(
      'when applying both Data Hub activity and DnB hierarchical filters',
      () => {
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
            user: {
              id: 123,
            },
          })

          await controllers.fetchActivityFeedHandler(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should call fetchActivityFeed with the right params', async () => {
          const { dataHubActivity } = ES_KEYS_GROUPED
          const expectedEsQuery = {
            from: 0,
            size: 20,
            sort: [
              {
                'object.startTime': {
                  order: 'desc',
                },
              },
            ],
            query: {
              bool: {
                filter: {
                  bool: {
                    must: [
                      {
                        terms: {
                          'object.type': dataHubActivity,
                        },
                      },
                      {
                        terms: {
                          'object.attributedTo.id': [
                            'dit:DataHubCompany:123',
                            'dit:DataHubCompany:456',
                            'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a',
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          }
          expect(fetchActivityFeedStub).to.be.calledWith(
            middlewareParameters.reqMock,
            expectedEsQuery
          )
        })
      }
    )

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
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        commonTests(
          dataHubActivity,
          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a'
        )
      })
    })

    context('when the endpoint returns error', () => {
      const error = {
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
          middlewareParameters.nextSpy
        )
      })

      it('should call next with an error', async () => {
        const { dataHubActivity } = ES_KEYS_GROUPED
        const expectedEsQuery = {
          from: 0,
          size: 20,
          sort: [
            {
              'object.startTime': {
                order: 'desc',
              },
            },
          ],
          query: {
            bool: {
              filter: {
                bool: {
                  must: [
                    {
                      terms: {
                        'object.type': dataHubActivity,
                      },
                    },
                    {
                      term: {
                        'object.attributedTo.id':
                          'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a',
                      },
                    },
                  ],
                },
              },
            },
          },
        }

        expect(fetchActivityFeedStub).to.be.calledWith(
          middlewareParameters.reqMock,
          expectedEsQuery
        )
        expect(middlewareParameters.resMock.json).to.not.have.been.called
        expect(middlewareParameters.nextSpy).to.have.been.calledWith(error)
      })
    })
  })
})
