const nock = require('nock')
const config = require('../../../../config')

/**
 * @function mockCompanyListsServer
 * @description Mocks the API (leeloo) end points needed to display the user's
 * list of company lists. The mocked endpoints are: `/v4/company-list` and
 * `/v4/company-list/<list-id>/item`.
 * @param {Object} options
 * @param {String} options.companyIdString - A string for each character of
 * which, there will be a company created in a dummy DB with the letter being
 * its ID.
 * @param {Object} options.listIds - A map of company list IDs to a set of
 * company IDs expressed as a string of letters which are members of the given
 * lists.
 * @returs The _mock_ scope.
 * @example
 * mockCompanyListsServer({
 *   companyIdString: 'abcd',
 *   listIds: {
 *      x: 'abc', // List x will contain companies a, b, c
 *      y: 'cd', // List y will contain companies b, c
 *      z: '', // List z will contain no companies
 *    },
 * })
 * // Requests to /v4/company-list and /v4/company-list/<list-id>/item` will
 * // now be handled by _nock_ and will resolve with dummy data.
 */
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

module.exports = {
  mockCompanyListsServer,
}
