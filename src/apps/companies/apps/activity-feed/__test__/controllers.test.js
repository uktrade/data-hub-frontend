const activityFeedEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-from-es.json')
const allActivityFeedEvents = require('../../../../../../test/sandbox/fixtures/v4/activity-feed/all-activity-feed-events.json')
const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/company.json')
const {
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
} = require('../constants')
const { eventsColListQueryBuilder } = require('../controllers')

describe('Activity feed controllers', () => {
  let fetchActivityFeedStub,
    fetchAllActivityFeedEventsStub,
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

    context(
      'when filtering on "Data Hub & External activity" for a company',
      () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestQuery: {
              activityTypeFilter: 'dataHubAndExternalActivity',
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

        it('should call fetchActivityFeed with the right params', async () => {
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
                    should: [
                      {
                        bool: {
                          must: [
                            {
                              terms: {
                                'object.type': DATA_HUB_AND_EXTERNAL_ACTIVITY,
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
                        },
                      },
                      {
                        bool: {
                          must: [
                            {
                              term: {
                                'object.type':
                                  'dit:directoryFormsApi:Submission',
                              },
                            },
                            {
                              term: {
                                'object.attributedTo.type':
                                  'dit:directoryFormsApi:SubmissionAction:gov-notify-email',
                              },
                            },
                            {
                              term: {
                                'object.url': '/contact/export-advice/comment/',
                              },
                            },
                            {
                              terms: {
                                'actor.dit:emailAddress': [
                                  'fred@acme.org',
                                  'fred@acme.org',
                                  'fred@acme.org',
                                  'byvanuwenu@yahoo.com',
                                ],
                              },
                            },
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
              must: [
                {
                  terms: {
                    'object.type': DATA_HUB_ACTIVITY,
                  },
                },
                {
                  term: {
                    'object.attributedTo.id': 'dit:DataHubAdviser:123',
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
              must: [
                {
                  terms: {
                    'object.type': DATA_HUB_ACTIVITY,
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
            },
          },
        }

        expect(fetchActivityFeedStub).to.be.calledWith(
          middlewareParameters.reqMock,
          expectedEsQuery
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
                  should: [
                    {
                      bool: {
                        must: [
                          {
                            terms: {
                              'object.type': EXTERNAL_ACTIVITY,
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
                      },
                    },
                    {
                      bool: {
                        must: [
                          {
                            term: {
                              'object.type': 'dit:directoryFormsApi:Submission',
                            },
                          },
                          {
                            term: {
                              'object.attributedTo.type':
                                'dit:directoryFormsApi:SubmissionAction:gov-notify-email',
                            },
                          },
                          {
                            term: {
                              'object.url': '/contact/export-advice/comment/',
                            },
                          },
                          {
                            terms: {
                              'actor.dit:emailAddress': [
                                'fred@acme.org',
                                'fred@acme.org',
                                'fred@acme.org',
                                'byvanuwenu@yahoo.com',
                              ],
                            },
                          },
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
                must: [
                  {
                    terms: {
                      'object.type': DATA_HUB_ACTIVITY,
                    },
                  },
                  {
                    terms: {
                      'object.attributedTo.id': [
                        'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a',
                        'dit:DataHubCompany:123',
                        'dit:DataHubCompany:456',
                      ],
                    },
                  },
                ],
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

      it('should default to dataHubActivity', async () => {
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
              must: [
                {
                  terms: {
                    'object.type': DATA_HUB_ACTIVITY,
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
            },
          },
        }

        expect(fetchActivityFeedStub).to.be.calledWith(
          middlewareParameters.reqMock,
          expectedEsQuery
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

      it('should call next with an error', async () => {
        expect(middlewareParameters.resMock.json).to.not.have.been.called
        expect(middlewareParameters.nextSpy).to.have.been.calledWith(error)
      })
    })
  })

  describe('#eventsColListQueryBuilder', () => {
    context('check query builder when filtering on event name', () => {
      it('builds the right query when being filtered by event name', () => {
        const name = 'cool event'
        const expectedQuery = [
          {
            terms: {
              'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
            },
          },
          {
            match: {
              'object.name': name,
            },
          },
        ]
        const actualQuery = eventsColListQueryBuilder({
          name: name,
        })

        expect(expectedQuery).to.deep.equal(actualQuery)
      })

      it('builds the right query when there is nothing entered into the event name filter', () => {
        const name = undefined
        const expectedQuery = [
          {
            terms: {
              'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
            },
          },
        ]
        const actualQuery = eventsColListQueryBuilder({
          name: name,
        })

        expect(expectedQuery).to.deep.equal(actualQuery)
      })
    })

    context(
      'check query builder when filtering on event start and end date',
      () => {
        const expectedQuery = (earliestStartDate, latestStartDate) => [
          {
            terms: {
              'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
            },
          },
          {
            range: {
              'object.startTime': {
                gte: earliestStartDate,
                lte: latestStartDate,
              },
            },
          },
        ]

        it('builds the right query when start date selected', () => {
          const earliestStartDate = '2022-11-01T08:39:06'
          const latestStartDate = undefined
          const actualQuery = eventsColListQueryBuilder({
            earliestStartDate: earliestStartDate,
            latestStartDate: latestStartDate,
          })

          expect(
            expectedQuery(earliestStartDate, latestStartDate)
          ).to.deep.equal(actualQuery)
        })

        it('builds the right query when the end date is selected', () => {
          const earliestStartDate = undefined
          const latestStartDate = '2022-12-12T08:39:06'
          const actualQuery = eventsColListQueryBuilder({
            earliestStartDate: earliestStartDate,
            latestStartDate: latestStartDate,
          })

          expect(
            expectedQuery(earliestStartDate, latestStartDate)
          ).to.deep.equal(actualQuery)
        })

        it('builds the right query when the start and end date is selected', () => {
          const earliestStartDate = '2022-11-01'
          const latestStartDate = '2022-12-12T08:39:06'
          const actualQuery = eventsColListQueryBuilder({
            earliestStartDate: earliestStartDate,
            latestStartDate: latestStartDate,
          })

          expect(
            expectedQuery(earliestStartDate, latestStartDate)
          ).to.deep.equal(actualQuery)
        })
      }
    )
  })

  describe('#fetchAllActivityFeedEvents', () => {
    before(() => {
      fetchAllActivityFeedEventsStub = sinon
        .stub()
        .resolves(allActivityFeedEvents)
      controllers = proxyquire(
        '../../src/apps/companies/apps/activity-feed/controllers',
        {
          './repos': {
            fetchActivityFeed: fetchAllActivityFeedEventsStub,
          },
        }
      )
    })

    context('when filtering for the events collection page', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          requestQuery: {
            sortBy: 'modified_on:desc',
            name: 'project zeus',
            earliestStartDate: '2020-11-01',
            latestStartDate: '2020-11-10',
            page: 1,
          },
        })

        await controllers.fetchAllActivityFeedEvents(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchAllActivityFeedEvents with the right params', async () => {
        const name = 'project zeus'
        const from = 0
        const size = 10
        const earliestStartDate = '2020-11-01'
        const latestStartDate = '2020-11-10'

        const expectedEsQuery = {
          from,
          size,
          query: {
            bool: {
              must: [
                {
                  terms: {
                    'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
                  },
                },
                {
                  match: {
                    'object.name': name,
                  },
                },
                {
                  range: {
                    'object.startTime': {
                      gte: earliestStartDate,
                      lte: latestStartDate,
                    },
                  },
                },
              ],
            },
          },
          sort: {
            'object.updated': {
              order: 'desc',
              unmapped_type: 'date',
            },
          },
        }

        expect(fetchAllActivityFeedEventsStub).to.be.calledWith(
          middlewareParameters.reqMock,
          expectedEsQuery
        )
      })
    })

    context('when the endpoint returns error', () => {
      const error = {
        status: 500,
      }

      before(async () => {
        fetchAllActivityFeedEventsStub.rejects(error)
        middlewareParameters = buildMiddlewareParameters({
          requestQuery: {},
        })

        await controllers.fetchAllActivityFeedEvents(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call next with an error', async () => {
        expect(middlewareParameters.resMock.json).to.not.have.been.called
        expect(middlewareParameters.nextSpy).to.have.been.calledWith(error)
      })
    })
  })
})
