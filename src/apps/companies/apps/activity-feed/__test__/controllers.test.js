const { faker } = require('@faker-js/faker')
const activityFeedEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-from-es.json')
const activityFeedAventriAtendeeEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-aventri-attendee-from-es.json')

const allActivityFeedEvents = require('../../../../../../test/sandbox/fixtures/v4/activity-feed/all-activity-feed-events.json')
const allAttendees = require('../../../../../../test/sandbox/fixtures/v4/activity-feed/aventri-attendees.json')
const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/company.json')
const aventriRegistrationStatusNoDetails = require('../../../../../../test/unit/data/activity-feed/aventri-registration-status-no-details.json')
const aventriRegistrationStatusWithAggregations = require('../../../../../../test/unit/data/activity-feed/aventri-registration-status-with-aggregation-counts.json')
const essDetails = require('../../../../../../test/sandbox/fixtures/v4/activity-feed/ess-interaction.json')
const contactMock = require('../../../../../../test/sandbox/fixtures/v3/contact/contact-by-id-uk.json')

const {
  DATA_HUB_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
  EVENT_AVENTRI_ATTENDEES_STATUS,
  EVENT_ATTENDEES_SORT_OPTIONS,
  EVENT_ATTENDEES_STATUS,
  EVENT_ATTENDEES_MAPPING,
  FILTER_FEED_TYPE,
} = require('../constants')
const {
  eventsColListQueryBuilder,
  isEssActivity,
  augmentEssActivity,
  filterContactListOnEmail,
} = require('../controllers')
const { has, get } = require('lodash')
const { sortCriteria } = require('../es-queries/sortCriteria')

const realDate = Date
const freezeTime = (constantDate) => {
  /*eslint no-global-assign:off*/
  Date = class extends Date {
    constructor() {
      return constantDate
    }
  }
}

describe('Activity feed controllers', () => {
  let fetchActivityFeedStub,
    fetchAllActivityFeedEventsStub,
    getGlobalUltimateHierarchyStub,
    controllers,
    middlewareParameters,
    fetchMatchingDataHubContactStub,
    fetchESSDetailsStub

  describe('#fetchActivityFeedHandler', () => {
    before(() => {
      const mockActivityFeedApiFunction = (req, body) => {
        //is this a query for aventriAttendeeForCompanyQuery
        if (has(body, 'query.bool.must[0].term')) {
          return activityFeedAventriAtendeeEsFixtures
        }

        return activityFeedEsFixtures
      }
      fetchActivityFeedStub = sinon
        .stub()
        .callsFake(mockActivityFeedApiFunction)
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

    context('when no filters are set query should default to all data', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            showDnbHierarchy: false,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchActivityFeed with correct params when retrieving aventri attendees', async () => {
        const expectedEsQuery = {
          from: 0,
          size: 20,
          sort: sortCriteria('desc'),
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
                    {
                      bool: {
                        must: [
                          { term: { 'object.type': 'dit:aventri:Event' } },
                          {
                            terms: {
                              id: [
                                'dit:aventri:Event:1:Create',
                                'dit:aventri:Event:2:Create',
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
                              'object.attributedTo.id':
                                'dit:directoryFormsApi:SubmissionType:export-support-service',
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

    context('Activty type filter', () => {
      context('when filtering on "internal" for a company', () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestQuery: {
              showDnbHierarchy: false,
              activityType: ['dataHubActivity'],
            },
          })

          await controllers.fetchActivityFeedHandler(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should include both internal and external if nothing is selected', async () => {})

        it('should call fetchActivityFeed with a internal filters', async () => {
          const expectedEsQuery = {
            from: 0,
            size: 20,
            sort: {
              _script: {
                type: 'number',
                script: {
                  lang: 'painless',
                  source:
                    "if (doc['object.startTime'].size() > 0) return doc['object.startTime'].value.toInstant().toEpochMilli(); return doc['published'].value.toInstant().toEpochMilli();",
                },
                order: 'desc',
              },
            },
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
                      {
                        bool: {
                          must: [
                            { term: { 'object.type': 'dit:aventri:Event' } },
                            {
                              terms: {
                                id: [
                                  'dit:aventri:Event:1:Create',
                                  'dit:aventri:Event:2:Create',
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
                                'object.attributedTo.id':
                                  'dit:directoryFormsApi:SubmissionType:export-support-service',
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

      context('when filtering on "external" for a company', () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestQuery: {
              showDnbHierarchy: false,
              activityType: ['externalActivity'],
            },
          })

          await controllers.fetchActivityFeedHandler(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should include both internal and external if nothing is selected', async () => {})

        it('should call fetchActivityFeed with a internal filters', async () => {
          const expectedEsQuery = {
            from: 0,
            size: 20,
            sort: {
              _script: {
                type: 'number',
                script: {
                  lang: 'painless',
                  source:
                    "if (doc['object.startTime'].size() > 0) return doc['object.startTime'].value.toInstant().toEpochMilli(); return doc['published'].value.toInstant().toEpochMilli();",
                },
                order: 'desc',
              },
            },
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
                                'object.type': [
                                  'dit:Accounts',
                                  'dit:Company',
                                  'dit:Export',
                                ],
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
      })
      context(
        'when filtering on both "internal" and "external" for a company',
        () => {
          before(async () => {
            middlewareParameters = buildMiddlewareParameters({
              company: companyMock,
              requestQuery: {
                showDnbHierarchy: false,
                activityType: ['dataHubActivity', 'externalActivity'],
              },
            })

            await controllers.fetchActivityFeedHandler(
              middlewareParameters.reqMock,
              middlewareParameters.resMock,
              middlewareParameters.nextSpy
            )
          })

          it('should include both internal and external if nothing is selected', async () => {})

          it('should call fetchActivityFeed with a internal filters', async () => {
            const expectedEsQuery = {
              from: 0,
              size: 20,
              sort: {
                _script: {
                  type: 'number',
                  script: {
                    lang: 'painless',
                    source:
                      "if (doc['object.startTime'].size() > 0) return doc['object.startTime'].value.toInstant().toEpochMilli(); return doc['published'].value.toInstant().toEpochMilli();",
                  },
                  order: 'desc',
                },
              },
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
                                  'object.type': [
                                    'dit:Interaction',
                                    'dit:ServiceDelivery',
                                    'dit:InvestmentProject',
                                    'dit:OMISOrder',
                                    'dit:CompanyReferral',
                                    'dit:aventri:Event',
                                    'dit:Accounts',
                                    'dit:Company',
                                    'dit:Export',
                                  ],
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
                                  'object.url':
                                    '/contact/export-advice/comment/',
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
                        {
                          bool: {
                            must: [
                              { term: { 'object.type': 'dit:aventri:Event' } },
                              {
                                terms: {
                                  id: [
                                    'dit:aventri:Event:1:Create',
                                    'dit:aventri:Event:2:Create',
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
                                  'object.attributedTo.id':
                                    'dit:directoryFormsApi:SubmissionType:export-support-service',
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
    })

    context('when filtering on "My activity" for a company', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            showDnbHierarchy: false,
            ditParticipantsAdviser: [123],
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
          sort: sortCriteria('desc'),
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
                          {
                            term: {
                              'object.attributedTo.id':
                                'dit:DataHubAdviser:123',
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
                          {
                            term: {
                              'object.attributedTo.id':
                                'dit:DataHubAdviser:123',
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { term: { 'object.type': 'dit:aventri:Event' } },
                          {
                            terms: {
                              id: [
                                'dit:aventri:Event:1:Create',
                                'dit:aventri:Event:2:Create',
                              ],
                            },
                          },
                          {
                            term: {
                              'object.attributedTo.id':
                                'dit:DataHubAdviser:123',
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
                              'object.attributedTo.id':
                                'dit:directoryFormsApi:SubmissionType:export-support-service',
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
                          {
                            term: {
                              'object.attributedTo.id':
                                'dit:DataHubAdviser:123',
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

    context('when filtering on default feed type', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            feedType: FILTER_FEED_TYPE.ALL,
            showDnbHierarchy: false,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      after(async () => {
        Date = realDate
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedEsQuery = {
          from: 0,
          size: 20,
          sort: sortCriteria('desc'),
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
                    {
                      bool: {
                        must: [
                          { term: { 'object.type': 'dit:aventri:Event' } },
                          {
                            terms: {
                              id: [
                                'dit:aventri:Event:1:Create',
                                'dit:aventri:Event:2:Create',
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
                              'object.attributedTo.id':
                                'dit:directoryFormsApi:SubmissionType:export-support-service',
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

    context('when filtering on recent feed type', () => {
      before(async () => {
        freezeTime(new Date('2015-10-02T04:41:20'))
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            feedType: 'recent',
            showDnbHierarchy: false,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      after(async () => {
        Date = realDate
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedEsQuery = {
          from: 0,
          size: 20,
          sort: sortCriteria('desc'),
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
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isBefore(dateBefore))",
                                params: {
                                  dateBefore: '2015-10-02T03:41:20.000Z',
                                },
                              },
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
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isBefore(dateBefore))",
                                params: {
                                  dateBefore: '2015-10-02T03:41:20.000Z',
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { term: { 'object.type': 'dit:aventri:Event' } },
                          {
                            terms: {
                              id: [
                                'dit:aventri:Event:1:Create',
                                'dit:aventri:Event:2:Create',
                              ],
                            },
                          },
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isBefore(dateBefore))",
                                params: {
                                  dateBefore: '2015-10-02T03:41:20.000Z',
                                },
                              },
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
                              'object.attributedTo.id':
                                'dit:directoryFormsApi:SubmissionType:export-support-service',
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
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isBefore(dateBefore))",
                                params: {
                                  dateBefore: '2015-10-02T03:41:20.000Z',
                                },
                              },
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

    context('when filtering on upcoming feed type', () => {
      before(async () => {
        freezeTime(new Date('2015-10-02T04:41:20'))
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            feedType: 'upcoming',
            showDnbHierarchy: false,
          },
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      after(async () => {
        Date = realDate
      })
      it('should call fetchActivityFeed with the right params', async () => {
        const expectedEsQuery = {
          from: 0,
          size: 20,
          sort: {
            _script: {
              type: 'number',
              script: {
                lang: 'painless',
                source:
                  "if (doc['object.startTime'].size() > 0) return doc['object.startTime'].value.toInstant().toEpochMilli(); return doc['published'].value.toInstant().toEpochMilli();",
              },
              order: 'asc',
            },
          },
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
                              'object.type': [
                                'dit:Interaction',
                                'dit:ServiceDelivery',
                                'dit:InvestmentProject',
                                'dit:OMISOrder',
                                'dit:CompanyReferral',
                                'dit:aventri:Event',
                                'dit:Accounts',
                                'dit:Company',
                                'dit:Export',
                              ],
                            },
                          },
                          {
                            terms: {
                              'object.attributedTo.id': [
                                'dit:DataHubCompany:dcdabbc9-1781-e411-8955-e4115bead28a',
                              ],
                            },
                          },
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
                                params: {
                                  dateAfter: '2015-10-02T03:41:20.000Z',
                                },
                              },
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
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
                                params: {
                                  dateAfter: '2015-10-02T03:41:20.000Z',
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { term: { 'object.type': 'dit:aventri:Event' } },
                          {
                            terms: {
                              id: [
                                'dit:aventri:Event:1:Create',
                                'dit:aventri:Event:2:Create',
                              ],
                            },
                          },
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
                                params: {
                                  dateAfter: '2015-10-02T03:41:20.000Z',
                                },
                              },
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
                              'object.attributedTo.id':
                                'dit:directoryFormsApi:SubmissionType:export-support-service',
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
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
                                params: {
                                  dateAfter: '2015-10-02T03:41:20.000Z',
                                },
                              },
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
            sort: sortCriteria('desc'),
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
                      {
                        bool: {
                          must: [
                            { term: { 'object.type': 'dit:aventri:Event' } },
                            {
                              terms: {
                                id: [
                                  'dit:aventri:Event:1:Create',
                                  'dit:aventri:Event:2:Create',
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
                                'object.attributedTo.id':
                                  'dit:directoryFormsApi:SubmissionType:export-support-service',
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

    context('when the endpoint returns error', () => {
      const error = {
        status: 404,
      }

      before(async () => {
        fetchActivityFeedStub.reset()
        fetchActivityFeedStub.rejects(error)
      })

      context('when the get aventri details endpoint returns error', () => {
        before(async () => {
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

      context('when the get aventri details endpoint returns error', () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestQuery: {
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

        it('should call next with an error', async () => {
          expect(middlewareParameters.resMock.json).to.not.have.been.called
          expect(middlewareParameters.nextSpy).to.have.been.calledWith(error)
        })
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
            match_phrase_prefix: {
              'object.name': name,
            },
          },
        ]
        const actualQuery = eventsColListQueryBuilder({
          name,
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
          name,
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
            earliestStartDate,
            latestStartDate,
          })

          expect(
            expectedQuery(earliestStartDate, latestStartDate)
          ).to.deep.equal(actualQuery)
        })

        it('builds the right query when the end date is selected', () => {
          const earliestStartDate = undefined
          const latestStartDate = '2022-12-12T08:39:06'
          const actualQuery = eventsColListQueryBuilder({
            earliestStartDate,
            latestStartDate,
          })

          expect(
            expectedQuery(earliestStartDate, latestStartDate)
          ).to.deep.equal(actualQuery)
        })

        it('builds the right query when the start and end date is selected', () => {
          const earliestStartDate = '2022-11-01'
          const latestStartDate = '2022-12-12T08:39:06'
          const actualQuery = eventsColListQueryBuilder({
            earliestStartDate,
            latestStartDate,
          })

          expect(
            expectedQuery(earliestStartDate, latestStartDate)
          ).to.deep.equal(actualQuery)
        })
      }
    )

    context('check query builder when filtering on aventri id', () => {
      const expectedQuery = (aventriId) => [
        {
          terms: {
            'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
          },
        },
        {
          term: {
            id: aventriId,
          },
        },
      ]

      it('builds the right query when an aventri id inputted into the filter box', () => {
        const aventriId = 123456789
        const transformedAventriId = 'dit:aventri:Event:123456789:Create'
        const actualQuery = eventsColListQueryBuilder({ aventriId })

        expect(expectedQuery(transformedAventriId)).to.deep.equal(actualQuery)
      })
    })

    context('check query builder when filtering on country', () => {
      const expectedQuery = (addressCountry) => [
        {
          terms: {
            'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
          },
        },
        {
          bool: {
            should: [
              {
                terms: {
                  'object.dit:address_country.name': addressCountry,
                },
              },
              {
                terms: {
                  'object.dit:aventri:location_country': addressCountry,
                },
              },
            ],
          },
        },
      ]

      it('builds the right query when a country is selected', () => {
        const addressCountry = ['Canada']
        const actualQuery = eventsColListQueryBuilder({ addressCountry })

        expect(expectedQuery(addressCountry)).to.deep.equal(actualQuery)
      })
    })

    context('check query builder when filtering on event type', () => {
      const expectedQuery = (eventType) => [
        {
          terms: {
            'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
          },
        },
        {
          terms: {
            'object.dit:eventType.id': eventType,
          },
        },
      ]

      it('builds the right query when a event type is selected', () => {
        const eventType = ['an-event-type-id']
        const actualQuery = eventsColListQueryBuilder({ eventType })

        expect(expectedQuery(eventType)).to.deep.equal(actualQuery)
      })
    })

    context('check query builder when filtering on uk region', () => {
      const expectedQuery = (ukRegion) => [
        {
          terms: {
            'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
          },
        },
        {
          terms: {
            'object.dit:ukRegion.id': ukRegion,
          },
        },
      ]

      it('builds the right query when a uk region is selected', () => {
        const ukRegion = ['1718e330-6095-e211-a939-e4115bead28a']
        const actualQuery = eventsColListQueryBuilder({ ukRegion })

        expect(expectedQuery(ukRegion)).to.deep.equal(actualQuery)
      })
    })

    context('check query builder when filtering on organiser', () => {
      const expectedQuery = (organiser) => [
        {
          terms: {
            'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
          },
        },
        {
          terms: {
            'object.dit:organiser.id': organiser,
          },
        },
      ]

      it('builds the right query when an organiser is selected', () => {
        const organiser = ['org-id-guid']
        const actualQuery = eventsColListQueryBuilder({ organiser })

        expect(expectedQuery(organiser)).to.deep.equal(actualQuery)
      })
    })
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
      const requestQuery = {
        sortBy: 'name:asc',
        name: 'project zeus',
        earliestStartDate: '2020-11-01',
        latestStartDate: '2020-11-10',
        page: 1,
        aventriId: 123456789,
        addressCountry: ['Canada', 'United Kingdom'],
        ukRegion: ['1718e330-6095-e211-a939-e4115bead28a'],
      }

      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          requestQuery,
        })

        await controllers.fetchAllActivityFeedEvents(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchAllActivityFeedEvents with the right params', async () => {
        const from = 0
        const size = 10
        const transformedAventriId = `dit:aventri:Event:${requestQuery.aventriId}:Create`

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
                  match_phrase_prefix: {
                    'object.name': requestQuery.name,
                  },
                },
                {
                  range: {
                    'object.startTime': {
                      gte: requestQuery.earliestStartDate,
                      lte: requestQuery.latestStartDate,
                    },
                  },
                },
                {
                  term: {
                    id: transformedAventriId,
                  },
                },
                {
                  bool: {
                    should: [
                      {
                        terms: {
                          'object.dit:address_country.name':
                            requestQuery.addressCountry,
                        },
                      },
                      {
                        terms: {
                          'object.dit:aventri:location_country':
                            requestQuery.addressCountry,
                        },
                      },
                    ],
                  },
                },
                {
                  terms: {
                    'object.dit:ukRegion.id': requestQuery.ukRegion,
                  },
                },
              ],
            },
          },
          sort: {
            'object.name.raw': {
              order: 'asc',
              unmapped_type: 'string',
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

  describe('#getAventriEventsAttendedByCompanyContacts', () => {
    let fakeActivityFeed = () => {
      return { hits: { hits: [] } }
    }

    const generateEventResponse = (hits) => {
      return {
        hits: {
          hits,
        },
      }
    }

    before(() => {
      fetchActivityFeedStub = sinon.stub().callsFake(fakeActivityFeed)
      controllers = proxyquire(
        '../../src/apps/companies/apps/activity-feed/controllers',
        {
          './repos': {
            fetchActivityFeed: fetchActivityFeedStub,
          },
        }
      )
      middlewareParameters = buildMiddlewareParameters()
    })

    it('when called with an empty list of contacts should return an empty event object', async () => {
      const events =
        await controllers.getAventriEventsAttendedByCompanyContacts(
          middlewareParameters.reqMock,
          middlewareParameters.nextSpy,
          []
        )
      expect(events).to.be.deep.equal({})
    })

    it('when called with a single contact that has no aventri events should return an empty event object', async () => {
      const events =
        await controllers.getAventriEventsAttendedByCompanyContacts(
          middlewareParameters.reqMock,
          middlewareParameters.nextSpy,
          [{ email: faker.internet.email }]
        )
      expect(events).to.be.deep.equal({})
    })

    it('when called with a single contact that has 1 aventri events should return an event object with 1 event and 1 contact email', async () => {
      const email = faker.internet.email()

      fetchActivityFeedStub.resolves(
        generateEventResponse([
          {
            _source: {
              object: {
                attributedTo: { id: 1 },
                'dit:emailAddress': email,
              },
            },
          },
        ])
      )

      const events =
        await controllers.getAventriEventsAttendedByCompanyContacts(
          middlewareParameters.reqMock,
          middlewareParameters.nextSpy,
          [
            {
              email: email,
              name: faker.person.fullName(),
              id: faker.string.numeric(),
            },
          ]
        )
      expect(events['1:Create'].length).to.be.equal(1)
      expect(events['1:Create'][0]['dit:emailAddress']).to.be.equal(email)
    })

    it('when called with a single contact that has 5 aventri events should return an event object with 5 events and 1 contact email', async () => {
      const email = faker.internet.email()

      fetchActivityFeedStub.resolves(
        generateEventResponse(
          [...Array(5).keys()].map((x) => {
            return {
              _source: {
                object: {
                  attributedTo: { id: x },
                  'dit:emailAddress': email,
                },
              },
            }
          })
        )
      )

      const events =
        await controllers.getAventriEventsAttendedByCompanyContacts(
          middlewareParameters.reqMock,
          middlewareParameters.nextSpy,
          [
            {
              email: email,
              name: faker.person.fullName(),
              id: faker.string.numeric(),
            },
          ]
        )
      expect(Object.keys(events).length).to.be.equal(5)
      Object.values(events).forEach((e) => {
        expect(e.length).to.be.equal(1)
        expect(e[0]['dit:emailAddress']).to.be.equal(email)
      })
    })

    it('when called with 3 contacts that attended different events should return an event object with 3 event and 1 contact emails', async () => {
      const emails = [
        faker.internet.email(),
        faker.internet.email(),
        faker.internet.email(),
      ]

      fetchActivityFeedStub.resolves(
        generateEventResponse(
          [...emails].map((x, index) => {
            return {
              _source: {
                object: {
                  attributedTo: { id: index },
                  'dit:emailAddress': x,
                },
              },
            }
          })
        )
      )

      const events =
        await controllers.getAventriEventsAttendedByCompanyContacts(
          middlewareParameters.reqMock,
          middlewareParameters.nextSpy,
          emails.map((x) => {
            return {
              email: x,
              name: faker.person.fullName(),
              id: faker.string.numeric(),
            }
          })
        )
      expect(Object.keys(events).length).to.be.equal(3)
      Object.values(events).forEach((e, index) => {
        expect(e.length).to.be.equal(1)
        expect(e[0]['dit:emailAddress']).to.be.equal(emails[index])
      })
    })

    it('when called with 3 contacts that attended the same event should return an event object with 1 event and 3 contact emails', async () => {
      const emails = [
        faker.internet.email(),
        faker.internet.email(),
        faker.internet.email(),
      ]
      const eventId = faker.string.numeric()

      fetchActivityFeedStub.resolves(
        generateEventResponse(
          [...emails].map((x) => {
            return {
              _source: {
                object: {
                  attributedTo: { id: eventId },
                  'dit:emailAddress': x,
                },
              },
            }
          })
        )
      )

      const events =
        await controllers.getAventriEventsAttendedByCompanyContacts(
          middlewareParameters.reqMock,
          middlewareParameters.nextSpy,
          emails.map((x) => {
            return {
              email: x,
              name: faker.person.fullName(),
              id: faker.string.numeric(),
            }
          })
        )
      expect(Object.keys(events).length).to.be.equal(1)

      Object.values(events).forEach((e, index) => {
        expect(e.length).to.be.equal(3)
        expect(e[0]['dit:emailAddress']).to.be.equal(emails[index])
      })
    })
  })

  describe('#filterContactListOnEmail', () => {
    it('filterContactListOnEmail removes contacts with empty email address', () => {
      const mockContactList = [
        {
          id: '9150ffcf-5b06-4229-9ede-5e5df836f213',
          first_name: 'test',
          last_name: 'no email',
          name: 'test no email',
          email: '',
          created_on: '2023-02-23T15:25:05.287511Z',
          modified_on: '2023-02-23T15:25:38.668575Z',
        },
        {
          id: '9150ffcf-5b06-4229-9ede-5e5df836f214',
          first_name: 'test',
          last_name: 'with email',
          name: 'test with email',
          email: 'test@test.com',
          created_on: '2023-02-23T15:25:05.287511Z',
          modified_on: '2023-02-23T15:25:38.668575Z',
        },
      ]

      expect(mockContactList.length).to.equal(2)

      const removedEmailList = filterContactListOnEmail(mockContactList)
      expect(removedEmailList.length).to.equal(1)
      expect(removedEmailList[0].name).to.equal('test with email')
    })
  })

  describe('#fetchAventriEventRegistrationStatusAttendees', () => {
    before(() => {
      fetchAllActivityFeedEventsStub = sinon.stub().resolves(allAttendees)
      fetchMatchingDataHubContactStub = sinon
        .stub()
        .resolves({ results: [{ id: 1 }] })

      controllers = proxyquire(
        '../../src/apps/companies/apps/activity-feed/controllers',
        {
          './repos': {
            fetchActivityFeed: fetchAllActivityFeedEventsStub,
            fetchMatchingDataHubContact: fetchMatchingDataHubContactStub,
          },
        }
      )
    })

    context('when requesting without a status an error is thrown', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          requestQuery: {},
        })

        await controllers.fetchAventriEventRegistrationStatusAttendees(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call next with an error', async () => {
        const error = 'Error: Missing registration status'
        expect(
          middlewareParameters.nextSpy.getCalls()[0].firstArg.toString()
        ).to.equal(error)
      })
    })

    context('when requesting an invalid status an error is thrown', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          requestQuery: {
            registrationStatus: 'FAKE',
          },
        })

        await controllers.fetchAventriEventRegistrationStatusAttendees(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call next with an error', async () => {
        const error = 'Error: Invalid status'
        expect(
          middlewareParameters.nextSpy.getCalls()[0].firstArg.toString()
        ).to.equal(error)
      })
    })

    context('when requesting attendees matching statuses', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          requestQuery: {
            registrationStatus: EVENT_ATTENDEES_STATUS.registered,
            page: 1,
            size: 25,
            sortBy: 'first_name:asc',
          },
          requestParams: { aventriEventId: 12 },
        })

        await controllers.fetchAventriEventRegistrationStatusAttendees(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchActivityFeed with the correct params', async () => {
        const expectedESQuery = {
          from: 0,
          size: 25,
          query: {
            bool: {
              must: [
                {
                  term: {
                    'object.type': 'dit:aventri:Attendee',
                  },
                },
                {
                  term: {
                    'object.attributedTo.id': `dit:aventri:Event:${12}`,
                  },
                },
                {
                  terms: {
                    'object.dit:registrationStatus':
                      EVENT_ATTENDEES_MAPPING[EVENT_ATTENDEES_STATUS.registered]
                        .statuses,
                  },
                },
              ],
            },
          },
          sort: EVENT_ATTENDEES_SORT_OPTIONS['first_name:asc'],
        }

        expect(fetchAllActivityFeedEventsStub).to.be.calledWith(
          middlewareParameters.reqMock,
          expectedESQuery
        )
      })

      it('should call fetchMatchingDataHubContacts with the correct ids', async () => {
        const attendeeEmails = allAttendees.hits.hits
          .map((hit) => hit._source.object['dit:aventri:email'])
          .filter((f) => f)

        attendeeEmails.forEach((email) =>
          expect(fetchMatchingDataHubContactStub).to.be.calledWith(
            middlewareParameters.reqMock,
            email
          )
        )
      })
    })
  })

  describe('#getAventriRegistrationStatusCounts', () => {
    let statusCounts
    before(async () => {
      const mockActivityFeedApiFunction = (req, body) => {
        //is this a query for empty registation status data
        if (
          get(
            body,
            "query.bool.must[1].term['object.attributedTo.id']"
          ).includes(1)
        ) {
          return aventriRegistrationStatusNoDetails
        }

        return aventriRegistrationStatusWithAggregations
      }
      fetchActivityFeedStub = sinon
        .stub()
        .callsFake(mockActivityFeedApiFunction)

      controllers = proxyquire(
        '../../src/apps/companies/apps/activity-feed/controllers',
        {
          './repos': {
            fetchActivityFeed: fetchActivityFeedStub,
          },
        }
      )
    })

    context('when requesting an event without any attendees', () => {
      it('should return an empty array', async () => {
        middlewareParameters = buildMiddlewareParameters()

        statusCounts = await controllers.getAventriRegistrationStatusCounts(
          middlewareParameters.reqMock,
          1
        )
        expect(statusCounts).to.be.deep.equal([])
      })
    })

    context('when requesting an event with attendees', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters()

        statusCounts = await controllers.getAventriRegistrationStatusCounts(
          middlewareParameters.reqMock,
          2
        )
      })

      it('should exclude any known status in the response with count of 0 from the aggregation result', () => {
        expect(
          statusCounts.find(
            (x) => x.status == EVENT_AVENTRI_ATTENDEES_STATUS.confirmed
          )
        ).to.be.undefined
      })

      it('should exclude any status in the response that is unknown from the aggregation result', () => {
        expect(statusCounts.find((x) => x.status == 'Incomplete')).to.be
          .undefined
      })

      it('should include all known statuses in the response with count greater than 0 from the aggregation result', () => {
        const statuses = [
          EVENT_AVENTRI_ATTENDEES_STATUS.attended,
          EVENT_AVENTRI_ATTENDEES_STATUS.activated,
          EVENT_AVENTRI_ATTENDEES_STATUS.waitlist,
          EVENT_AVENTRI_ATTENDEES_STATUS.noShow,
          EVENT_AVENTRI_ATTENDEES_STATUS.cancelled,
        ]
        statuses.forEach(
          (s) =>
            expect(statusCounts.find((x) => x.status == s)).to.not.be.undefined
        )
      })
    })
  })

  describe('#fetchESSDetails', () => {
    before(() => {
      fetchESSDetailsStub = sinon.stub().resolves(essDetails)
      controllers = proxyquire(
        '../../src/apps/companies/apps/activity-feed/controllers',
        {
          './repos': {
            fetchActivityFeed: fetchESSDetailsStub,
          },
        }
      )
    })

    context('when getting ess details', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          requestParams: { essInteractionId: 1111 },
        })

        await controllers.fetchESSDetails(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call fetchESSDetails with the right params', async () => {
        const essDetailId = `dit:directoryFormsApi:Submission:1111:Create`
        const expectedEsQuery = {
          query: {
            bool: {
              must: [
                {
                  term: {
                    id: essDetailId,
                  },
                },
              ],
            },
          },
        }

        expect(fetchESSDetailsStub).to.be.calledWith(
          middlewareParameters.reqMock,
          expectedEsQuery
        )
      })

      context('when the endpoint returns error', () => {
        const error = {
          status: 500,
        }

        before(async () => {
          fetchESSDetailsStub.rejects(error)
          middlewareParameters = buildMiddlewareParameters({
            requestParams: {},
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
  describe('#fetchActivitiesForContact', () => {
    before(() => {
      fetchESSDetailsStub = sinon.stub().resolves(essDetails)

      controllers = proxyquire(
        '../../src/apps/companies/apps/activity-feed/controllers',
        {
          './repos': {
            fetchActivityFeed: fetchESSDetailsStub,
          },
        }
      )
    })

    context(
      'when returning contact activities including ESS activities',
      () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            requestQuery: { selectedSortBy: 'desc', page: 1 },
            contact: contactMock,
          })
        })

        it('should return results', async () => {
          await controllers.fetchActivitiesForContact(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )

          expect(middlewareParameters.resMock.json).to.have.been.called
        })

        it('isEssActivity returns true if activity is an Ess Activity', () => {
          const activity = {
            object: {
              type: 'dit:directoryFormsApi:Submission',
              attributedTo: {
                id: 'dit:directoryFormsApi:SubmissionType:export-support-service',
              },
            },
          }
          const result = isEssActivity(activity)
          expect(result).to.be.true
        })

        it('isEssActivity returns false if activity is not an Ess Activity', () => {
          const activity = {
            object: {
              type: 'IAmNotA_dit:directoryFormsApi:Submission',
              attributedTo: {
                id: 'dit:directoryFormsApi:SubmissionType:UNKNOWN_Service',
              },
            },
          }
          const result = isEssActivity(activity)
          expect(result).to.be.false
        })

        it('augmentEssActivity returns activity with contact details and start time', () => {
          const initialActivity = {
            object: {
              type: 'dit:directoryFormsApi:Submission',
              attributedTo: {
                id: 'dit:directoryFormsApi:SubmissionType:export-support-service',
              },
            },
            published: '2022-12-02T16:48:19.344421+00:00',
          }
          const augmentedActivity = {
            object: {
              type: 'dit:directoryFormsApi:Submission',
              attributedTo: [
                {
                  id: 'dit:directoryFormsApi:SubmissionType:export-support-service',
                },
                {
                  'dit:emailAddress': 'contact@bob.com',
                  name: 'Joseph Woof',
                  id: 'f3d19ea7-d4cf-43e0-8e97-755c57cae313',
                  type: ['dit:Contact'],
                  url: '/contacts/f3d19ea7-d4cf-43e0-8e97-755c57cae313/details',
                },
              ],
            },
            published: '2022-12-02T16:48:19.344421+00:00',
          }

          const result = augmentEssActivity(initialActivity, contactMock)
          expect(result).to.deep.equal(augmentedActivity)
        })
      }
    )
  })
})
