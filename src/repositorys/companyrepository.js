/* eslint camelcase: 0 */
const config = require('../config')
const authorisedRequest = require('../lib/authorisedrequest')
const metadataRepository = require('../repositorys/metadatarepository')
const Q = require('q')
const winston = require('winston')

// Get a company and then pad out the interactions with related data
function getDitCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/company/${id}/`)
}

function getCHCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/ch-company/${id}/`)
}

function saveCompany (token, company) {
  function saveParsedCompany (parsedCompany) {
    let method
    let url

    if (parsedCompany.id && parsedCompany.id.length > 0) {
      method = 'PUT'
      url = `${config.apiRoot}/company/${parsedCompany.id}/`
    } else {
      method = 'POST'
      url = `${config.apiRoot}/company/`
    }

    return new Promise((resolve, reject) => {
      authorisedRequest(token, { url, method, body: parsedCompany })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          if (typeof error.error === 'string') {
            return reject({
              statusCode: error.response.statusCode,
              errors: { detail: error.response.statusMessage }
            })
          }

          return reject({
            statusCode: error.response.statusCode,
            errors: error.error
          })
        })
    })
  }

  delete company.companies_house_data
  delete company.contacts
  delete company.interactions

  if (company.id && company.id.length > 0) {
    return saveParsedCompany(company)
  }

  return setCHDefaults(token, company)
    .then(parsedCompany => saveParsedCompany(parsedCompany))
}

function archiveCompany (token, companyId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/company/${companyId}/archive/`,
    method: 'POST'
  }
  return authorisedRequest(token, options)
}

function unarchiveCompany (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/company/${companyId}/unarchive/`)
}

function setCHDefaults (token, company) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        if (company.company_number) {
          const ch = yield getCHCompany(token, company.company_number)
          if (!company.name) company.name = ch.name
          if (!company.registered_address_1) company.registered_address_1 = ch.registered_address_1
          if (!company.registered_address_2) company.registered_address_2 = ch.registered_address_2
          if (!company.registered_address_town) company.registered_address_town = ch.registered_address_town
          if (!company.registered_address_county) company.registered_address_county = ch.registered_address_county
          if (!company.registered_address_postcode) company.registered_address_postcode = ch.registered_address_postcode
          if (!company.registered_address_country) company.registered_address_country = ch.registered_address_country.id
          company.uk_based = true

          // Business type
          const businessTypes = metadataRepository.TYPES_OF_BUSINESS
          for (const businessType of businessTypes) {
            if (businessType.name.toLowerCase() === ch.company_category.toLowerCase()) {
              company.business_type = businessType.id
            }
          }
        }
        resolve(company)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

module.exports = {
  saveCompany,
  getDitCompany,
  getCHCompany,
  archiveCompany,
  unarchiveCompany
}
