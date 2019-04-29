/* eslint camelcase: 0, prefer-promise-reject-errors: 0 */
const { get } = require('lodash')

const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

// TODO remove this when no dependencies on company.registered_address_* and company.trading_address_*
const mapDeprecatedAddressFields = (companyAddress, deprecatedAddressPrefix) => {
  return {
    [`${deprecatedAddressPrefix}_address_1`]: get(companyAddress, 'line_1'),
    [`${deprecatedAddressPrefix}_address_2`]: get(companyAddress, 'line_2'),
    [`${deprecatedAddressPrefix}_address_town`]: get(companyAddress, 'town'),
    [`${deprecatedAddressPrefix}_address_county`]: get(companyAddress, 'county'),
    [`${deprecatedAddressPrefix}_address_postcode`]: get(companyAddress, 'postcode'),
    [`${deprecatedAddressPrefix}_address_country`]: get(companyAddress, 'country'),
  }
}

function getDitCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v4/company/${id}`)
    .then((company) => {
      return {
        ...company,
        ...mapDeprecatedAddressFields(company.address, 'trading'),
        ...mapDeprecatedAddressFields(company.registered_address, 'registered'),
      }
    })
}

function getCHCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v4/ch-company/${id}`)
}

function saveCompany (token, company) {
  return company.id ? updateCompany(token, company.id, company) : addCompany(token, company)
}

function archiveCompany (token, companyId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v3/company/${companyId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(token, options)
}

function unarchiveCompany (token, companyId) {
  return authorisedRequest(token, {
    method: 'POST',
    url: `${config.apiRoot}/v3/company/${companyId}/unarchive`,
  })
}

function addCompany (token, body) {
  return authorisedRequest(token, {
    body,
    url: `${config.apiRoot}/v4/company`,
    method: 'POST',
  })
}

function updateCompany (token, companyId, body) {
  return authorisedRequest(token, {
    body,
    url: `${config.apiRoot}/v4/company/${companyId}`,
    method: 'PATCH',
  })
}

function getCompanyAuditLog (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company/${companyId}/audit`,
    qs: { limit, offset },
  })
}

function getCompanyTimeline (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company/${companyId}/timeline`,
    qs: { limit, offset },
  })
}

function getCompanySubsidiaries (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company`,
    qs: {
      limit,
      offset,
      sortby: 'name',
      global_headquarters_id: companyId,
    },
  })
}

function getOneListGroupCoreTeam (token, companyId) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/company/${companyId}/one-list-group-core-team`,
  })
}

module.exports = {
  saveCompany,
  getDitCompany,
  getCHCompany,
  archiveCompany,
  unarchiveCompany,
  updateCompany,
  getCompanyAuditLog,
  getCompanyTimeline,
  getCompanySubsidiaries,
  getOneListGroupCoreTeam,
}
