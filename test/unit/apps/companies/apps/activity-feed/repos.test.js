const config = require('~/config')
const activityFeedRawFixture = require('~/test/unit/data/activity-feed/activity-feed-from-es')

const token = 'abcd'
const sortQuery = {
  _script: {
    type: 'string',
    script: {
      lang: 'painless',
      source: "return !doc['object.startTime'].empty ? doc['object.startTime'].value : doc['published'].value",
    },
    order: 'desc',
  },
}

describe('Activity feed repos', () => {
  beforeEach(() => {
    this.authorisedRequestStub = sinon.stub().resolves(activityFeedRawFixture)
    this.repos = proxyquire('../../src/apps/companies/apps/activity-feed/repos', {
      '../../../../lib/authorised-request': { authorisedRequest: this.authorisedRequestStub },
    })
  })

  describe('#fetchActivityFeed', () => {
    context('when called with companyId', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed({ token, from: 1, size: 21, companyId: '123' })
      })

      it('should make a request without company ID in the request body', () => {
        const expectedBody = {
          from: 1,
          query: {
            bool: {
              filter: [
                { term: { 'object.attributedTo.id': 'dit:DataHubCompany:123' } },
                { terms: { 'object.type': [
                  'dit:Interaction',
                  'dit:ServiceDelivery',
                  'dit:InvestmentProject',
                  'dit:OMISOrder',
                ] } },
              ],
            },
          },
          size: 21,
          sort: sortQuery,
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(token, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture)
      })
    })

    context('when called without companyId', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed({ token, from: 0, size: 20 })
      })

      it('should make a request without company ID in the request body', () => {
        const expectedBody = {
          from: 0,
          size: 20,
          sort: sortQuery,
          query: {
            bool: {
              filter: [
                { term: { 'object.attributedTo.id': 'dit:DataHubCompany:undefined' } },
                { terms: { 'object.type': [
                  'dit:Interaction',
                  'dit:ServiceDelivery',
                  'dit:InvestmentProject',
                  'dit:OMISOrder',
                ] } },
              ],
            },
          },
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(token, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture)
      })
    })

    context('when called without any params', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed({})
      })

      it('should make a request with default params', async () => {
        const expectedBody = {
          from: 0,
          size: 20,
          sort: sortQuery,
          query: {
            bool: {
              filter: [
                { term: { 'object.attributedTo.id': 'dit:DataHubCompany:undefined' } },
                { terms: { 'object.type': [
                  'dit:Interaction',
                  'dit:ServiceDelivery',
                  'dit:InvestmentProject',
                  'dit:OMISOrder',
                ] } },
              ],
            },
          },
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(undefined, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture)
      })
    })
  })
})
