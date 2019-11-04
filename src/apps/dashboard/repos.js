const { pick } = require('lodash')
const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../config')

function fetchHomepageData (token) {
  return authorisedRequest(token, `${config.apiRoot}/dashboard/homepage/`)
}

function fetchRawCompanyListItems (token, id) {
  return authorisedRequest(token, {
    method: 'GET',
    url: `${config.apiRoot}/v4/company-list/${id}/item`,
  })
}

const fetchRawCompanyList = token =>
  authorisedRequest(token, {
    method: 'GET',
    url: `${config.apiRoot}/v4/company-list`,
  })

/* eslint-disable-next-line camelcase */
const transformRawCompany = ({ latest_interaction, company }) => ({
  company: pick(company, ['id', 'name']),
  latestInteraction: pick(latest_interaction, ['date', 'id', 'subject']),
})

const fetchCompanyLists = token =>
  fetchRawCompanyList(token)
    .then(({ results }) =>
      Promise.all(
        results.map(
          list =>
            fetchRawCompanyListItems(token, list.id)
              .then(({ results }) => ({
                ...pick(list, ['id', 'name']),
                companies: results.map(transformRawCompany),
              }))
        )
      )
    )

module.exports = {
  fetchHomepageData,
  fetchCompanyLists,
}
