const { get } = require('lodash')

const activityFeedEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-from-es.json')
const activityFeedAventriAtendeeEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-aventri-attendee-from-es.json')
const activityFeedMaxemailSentEsFixtures = require('../../../../../../test/unit/data/activity-feed/activity-feed-maxemail-sent-from-es.json')
const activityFeedDefaultQuery = require('../../../../../../test/unit/data/activity-feed/activity-feed-default-query.json')

const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/company.json')
const essDetails = require('../../../../../../test/sandbox/fixtures/v4/activity-feed/ess-interaction.json')

const { FILTER_FEED_TYPE } = require('../constants')
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
    getRelatedCompaniesStub,
    controllers,
    middlewareParameters,
    fetchESSDetailsStub

  describe('#fetchActivityFeedHandler', () => {
    before(() => {
      const mockActivityFeedApiFunction = (req, body) => {
        if (
          get(body, "query.bool.must[0].term['object.type']") ===
          'dit:aventri:Attendee'
        ) {
          return activityFeedAventriAtendeeEsFixtures
        }
        if (
          get(body, "query.bool.must[0].term['object.type']") ===
          'dit:maxemail:Email:Sent'
        ) {
          return activityFeedMaxemailSentEsFixtures
        }

        return activityFeedEsFixtures
      }
      fetchActivityFeedStub = sinon
        .stub()
        .callsFake(mockActivityFeedApiFunction)

      getRelatedCompaniesStub = sinon
        .stub()
        .resolves({ related_companies: ['123', '456'] })

      controllers = proxyquire(
        '../../src/apps/companies/apps/activity-feed/controllers',
        {
          './repos': {
            fetchActivityFeed: fetchActivityFeedStub,
          },
          '../../repos': {
            getRelatedCompanies: getRelatedCompaniesStub,
          },
        }
      )
    })

    context('when no filters are set query should default to all data', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {},
        })

        await controllers.fetchActivityFeedHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })
    })

    context('Activity sort', () => {
      context('default sort order should be desc', () => {
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

        it('should call fetchActivityFeed with a internal filters', async () => {
          const expectedEsQuery = {
            from: 0,
            size: 20,
            sort: sortCriteria('desc'),
            query: activityFeedDefaultQuery,
          }

          expect(fetchActivityFeedStub).to.be.calledWith(
            middlewareParameters.reqMock,
            expectedEsQuery
          )
        })
      })

      context('when sorting sort order should be reflected in query', () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestQuery: {
              showDnbHierarchy: false,
              sortby: 'date:asc',
              activityType: ['dataHubActivity'],
            },
          })

          await controllers.fetchActivityFeedHandler(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should call fetchActivityFeed with a internal filters', async () => {
          const expectedEsQuery = {
            from: 0,
            size: 20,
            sort: sortCriteria('asc'),
            query: activityFeedDefaultQuery,
          }

          expect(fetchActivityFeedStub).to.be.calledWith(
            middlewareParameters.reqMock,
            expectedEsQuery
          )
        })
      })
    })

    context('Activity type filter', () => {
      context('when filtering on "internal" for a company', () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestQuery: {
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
            sort: sortCriteria('desc'),
            query: activityFeedDefaultQuery,
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
                              {
                                term: {
                                  'object.type': 'dit:maxemail:Campaign',
                                },
                              },
                              {
                                terms: {
                                  id: [
                                    'dit:maxemail:Campaign:123:Create',
                                    'dit:maxemail:Campaign:124:Create',
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
    })

    context('when filtering on "Other activity" for a company', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            createdByOthers: [123],
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
    })

    context('when filtering on default feed type', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            feedType: FILTER_FEED_TYPE.ALL,
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
    })

    context('when filtering on recent feed type', () => {
      before(async () => {
        freezeTime(new Date('2015-10-02T04:41:20'))
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            feedType: 'recent',
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
    })

    context('when filtering on upcoming feed type', () => {
      before(async () => {
        freezeTime(new Date('2015-10-02T04:41:20'))
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            feedType: 'upcoming',
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
          sort: sortCriteria('asc'),
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
                                  "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
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
                                  "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
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
                              'object.type': 'dit:maxemail:Campaign',
                            },
                          },
                          {
                            terms: {
                              id: [
                                'dit:maxemail:Campaign:123:Create',
                                'dit:maxemail:Campaign:124:Create',
                              ],
                            },
                          },
                          {
                            script: {
                              script: {
                                lang: 'painless',
                                source:
                                  "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
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
                                  "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
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
                                  "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); return (filterDateTime.isAfter(dateAfter))",
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
      'when filtering on date they should include activities for the entire day',
      () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestQuery: {
              dateAfter: '2002-06-13',
              dateBefore: '2022-06-13',
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
                                    "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isAfter(dateAfter) && filterDateTime.isBefore(dateBefore))",
                                  params: {
                                    dateAfter: '2002-06-13T00:00:00.000Z',
                                    dateBefore: '2022-06-13T23:59:59.999Z',
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
                            {
                              script: {
                                script: {
                                  lang: 'painless',
                                  source:
                                    "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isAfter(dateAfter) && filterDateTime.isBefore(dateBefore))",
                                  params: {
                                    dateAfter: '2002-06-13T00:00:00.000Z',
                                    dateBefore: '2022-06-13T23:59:59.999Z',
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
                                'object.type': 'dit:maxemail:Campaign',
                              },
                            },
                            {
                              terms: {
                                id: [
                                  'dit:maxemail:Campaign:123:Create',
                                  'dit:maxemail:Campaign:124:Create',
                                ],
                              },
                            },
                            {
                              script: {
                                script: {
                                  lang: 'painless',
                                  source:
                                    "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isAfter(dateAfter) && filterDateTime.isBefore(dateBefore))",
                                  params: {
                                    dateAfter: '2002-06-13T00:00:00.000Z',
                                    dateBefore: '2022-06-13T23:59:59.999Z',
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
                                    "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isAfter(dateAfter) && filterDateTime.isBefore(dateBefore))",
                                  params: {
                                    dateAfter: '2002-06-13T00:00:00.000Z',
                                    dateBefore: '2022-06-13T23:59:59.999Z',
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
                                    "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime dateAfter = ZonedDateTime.parse(params['dateAfter']); ZonedDateTime dateBefore = ZonedDateTime.parse(params['dateBefore']); return (filterDateTime.isAfter(dateAfter) && filterDateTime.isBefore(dateBefore))",
                                  params: {
                                    dateAfter: '2002-06-13T00:00:00.000Z',
                                    dateBefore: '2022-06-13T23:59:59.999Z',
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
      }
    )

    context(
      'when applying both Data Hub activity and related company filters',
      () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            user: {
              id: 123,
            },
            requestQuery: {
              include_parent_companies: true,
              include_subsidiary_companies: false,
            },
          })

          await controllers.fetchActivityFeedHandler(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
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
            requestQuery: {},
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
})
