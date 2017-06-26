/* eslint camelcase: 0, prefer-promise-reject-errors: 0 */
const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

// Get a company and then pad out the interactions with related data
function getDitCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/company/${id}/`)
}

function getCHCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/ch-company/${id}/`)
}

function saveCompany (token, company) {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedCompany = Object.assign({}, company)
      delete parsedCompany.companies_house_data
      delete parsedCompany.contacts
      delete parsedCompany.interactions

      let method
      let url

      if (parsedCompany.id && parsedCompany.id.length > 0) {
        method = 'PUT'
        url = `${config.apiRoot}/company/${parsedCompany.id}/`
      } else {
        delete parsedCompany.id
        method = 'POST'
        url = `${config.apiRoot}/company/`
      }

      const data = await authorisedRequest(token, { url, method, body: parsedCompany })
      resolve(data)
    } catch (error) {
      if (typeof error.error === 'string') {
        reject({
          statusCode: error.response.statusCode,
          errors: { detail: error.response.statusMessage },
        })
      } else {
        reject({
          statusCode: error.response.statusCode,
          errors: error.error,
        })
      }
    }
  })
}

function archiveCompany (token, companyId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/company/${companyId}/archive/`,
    method: 'POST',
  }
  return authorisedRequest(token, options)
}

function unarchiveCompany (token, companyId) {
  return authorisedRequest(token, {
    method: 'POST',
    url: `${config.apiRoot}/company/${companyId}/unarchive/`,
  })
}

module.exports = {
  saveCompany,
  getDitCompany,
  getCHCompany,
  archiveCompany,
  unarchiveCompany,
}
