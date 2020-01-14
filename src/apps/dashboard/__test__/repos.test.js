const repos = require('../../../../src/apps/dashboard/repos')
const { mockCompanyListsServer } = require('./utils')

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
            ditParticipants: [],
          },
          {
            company: {
              id: 'c',
              name: 'Company C',
            },
            latestInteraction: {},
            ditParticipants: [],
          },
          {
            company: {
              id: 'e',
              name: 'Company E',
            },
            latestInteraction: {},
            ditParticipants: [],
          },
          {
            company: {
              id: 'g',
              name: 'Company G',
            },
            latestInteraction: {},
            ditParticipants: [],
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
            ditParticipants: [],
          },
          {
            company: {
              id: 'b',
              name: 'Company B',
            },
            latestInteraction: {},
            ditParticipants: [],
          },
          {
            company: {
              id: 'c',
              name: 'Company C',
            },
            latestInteraction: {},
            ditParticipants: [],
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
            ditParticipants: [],
          },
          {
            company: {
              id: 'd',
              name: 'Company D',
            },
            latestInteraction: {},
            ditParticipants: [],
          },
          {
            company: {
              id: 'f',
              name: 'Company F',
            },
            latestInteraction: {},
            ditParticipants: [],
          },
          {
            company: {
              id: 'h',
              name: 'Company H',
            },
            latestInteraction: {},
            ditParticipants: [],
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
            ditParticipants: [],
          },
          {
            company: {
              id: 'f',
              name: 'Company F',
            },
            latestInteraction: {},
            ditParticipants: [],
          },
          {
            company: {
              id: 'g',
              name: 'Company G',
            },
            latestInteraction: {},
            ditParticipants: [],
          },
        ],
      },
    ])
  })
})

module.exports = {
  mockCompanyListsServer,
}
