const nock = require('nock')
const config = require('../../../../config')
const repos = require('../../../../src/apps/dashboard/repos')

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

const mockCompanyListsServer = ({ companyIdString = '', listIds = {} } = {}) => {
  const companyListItemRegexp = /\/v4\/company-list\/([^/]+)\/item/

  const companies = [...companyIdString].reduce(
    (acc, id) => ({
      ...acc,
      [id]: {
        company: {
          id,
          name: `Company ${id.toUpperCase()}`,
          archived: false,
          trading_names: [],
        },
        latest_interaction: {},
      },
    }),
    {}
  )

  const lists = Object.entries(listIds).reduce(
    (acc, [listIdStr, companyIds]) => ({
      ...acc,
      [listIdStr]: {
        count: companyIds.length,
        next: null,
        previous: null,
        results: [...companyIds].map(id => companies[id]),
      },
    }),
    {},
  )

  const userLists = {
    count: Object.keys(lists).length,
    next: null,
    previous: null,
    results: Object.entries(lists).reduce(
      (acc, [id, list]) => [
        ...acc,
        {
          id,
          item_count: list.count,
          name: `Company List ${id.toUpperCase()}`,
          created_on: new Date().toISOString(),
        },
      ],
      [],
    ),
  }

  const scope = nock(config.apiRoot)
    .get('/v4/company-list')
    .reply(200, userLists)

  const numberOfLists = Object.keys(listIds).length
  if (numberOfLists) {
    return scope
      .get(companyListItemRegexp)
      .times(numberOfLists)
      .reply(200, uri => lists[uri.match(companyListItemRegexp)[1]])
  }

  return scope
}

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
