const config = require('../../../../config')
const repos = require('../../../../src/apps/dashboard/repos')
const { mockCompanyListsServer } = require('./utils')

function makeRepositoryWithAuthRequest (authorisedRequestStub) {
  return proxyquire('~/src/apps/dashboard/repos.js', {
    '../../lib/authorised-request': { authorisedRequest: authorisedRequestStub },
  })
}

describe('Dashboard', () => {
  beforeEach(() => {
    this.authorisedRequestStub = sinon.stub()
    this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
  })
  describe('#fetchHomepageData', () => {
    it('should call the Zen desk API', async () => {
      await this.repo.fetchHomepageData('TEST_TOKEN')
      expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', `${config.apiRoot}/dashboard/homepage/`)
    })
  })
})

describe('fetchCompanyLists', () => {
  describe('No lists', async () => {
    mockCompanyListsServer()
    expect(await repos.fetchCompanyLists('DUMMY TOKEN')).to.deep.equal([])
  })

  describe('Many lists', async () => {
    mockCompanyListsServer({
      companyIdString: 'abcdefgh',
      listIds: {
        u: '',
        v: 'aceg',
        x: 'abc',
        y: 'bdfh',
        z: 'efg',
      },
    })

    expect(await repos.fetchCompanyLists('DUMMY TOKEN')).to.deep.equal([
      {
        id: 'u',
        name: 'Company List U',
        companies: [],
      },
      {
        id: 'v',
        name: 'Company List V',
        companies: [
          {
            company: {
              id: 'a',
              name: 'Company A',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'c',
              name: 'Company C',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'e',
              name: 'Company E',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'g',
              name: 'Company G',
            },
            latestInteraction: {},
          },
        ],
      },
      {
        id: 'x',
        name: 'Company List X',
        companies: [
          {
            company: {
              id: 'a',
              name: 'Company A',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'b',
              name: 'Company B',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'c',
              name: 'Company C',
            },
            latestInteraction: {},
          },
        ],
      },
      {
        id: 'y',
        name: 'Company List Y',
        companies: [
          {
            company: {
              id: 'b',
              name: 'Company B',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'd',
              name: 'Company D',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'f',
              name: 'Company F',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'h',
              name: 'Company H',
            },
            latestInteraction: {},
          },
        ],
      },
      {
        id: 'z',
        name: 'Company List Z',
        companies: [
          {
            company: {
              id: 'e',
              name: 'Company E',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'f',
              name: 'Company F',
            },
            latestInteraction: {},
          },
          {
            company: {
              id: 'g',
              name: 'Company G',
            },
            latestInteraction: {},
          },
        ],
      },
    ])
  })
})

module.exports = {
  mockCompanyListsServer,
}
