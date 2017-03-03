/* eslint camelcase: 0 */
const Q = require('q')
const config = require('../config')
const axios = require('axios')
const authorisedRequest = require('../lib/authorisedrequest')
const metadataRepository = require('./metadatarepository')
const controllerUtils = require('../lib/controllerutils')

const relatedProperties = {
  'sector': 'SECTOR_OPTIONS',
  'turnover_range': 'TURNOVER_OPTIONS',
  'uk_region': 'REGION_OPTIONS',
  'employee_range': 'EMPLOYEE_OPTIONS',
  'registered_address_country': 'COUNTRYS',
  'trading_address_country': 'COUNTRYS'
}

function request (url) {
  return new Promise((resolve, reject) => {
    axios(url)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

function getCompanyContacts (id) {
  // todo
}

function getCompanyInteractions (id) {

}

// Get a company and then go back and get further details about it
function getDitCompany (id) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *main () {
      try {
        const company = yield request(`${config.apiRoot}/company/${id}/`)

        // get related information
        const relatedKeys = Object.keys(relatedProperties)
        for (const property of relatedKeys) {
          if (company[property] && company[property].length > 0) {
            const metadataKey = relatedProperties[property]
            const values = metadataRepository[metadataKey]
            company[property] = values.filter(item => item.id === company[property])[0]
          }
        }

        // get related companies
        const relatedCompanies = yield request(`${config.apiRoot}/company/${company.id}/related/`)
        company.parents = []
        for (const id of relatedCompanies.parents) {
          const parent = yield request(`${config.apiRoot}/company/${id}/`)
          company.parents.push(parent)
        }

        company.children = []
        for (const id of relatedCompanies.children) {
          const child = yield request(`${config.apiRoot}/company/${id}/`)
          company.children.push(child)
        }

        if (company.company_number && company.company_number.length > 0) {
          const ch = yield request(`${config.apiRoot}/ch-company/${company.company_number}/`)
          company.companies_house_data = ch
        }
        resolve(company)
      } catch (error) {
        reject(error)
      }
    })
  })
}

function getDitCompanyLite (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/company/${id}/`)
}

function getCHCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/ch-company/${id}/`)
}

function getCompany (token, id, source) {
  return new Promise((resolve, reject) => {
    // Get DIT Company
    if (source === 'company_companieshousecompany') {
      getCHCompany(token, id)
      .then((companies_house_data) => {
        resolve({
          company_number: id,
          companies_house_data,
          contacts: [],
          interactions: []
        })
      })
      .catch((error) => {
        reject(error)
      })

      return
    }

    getDitCompany(id)
      .then((company) => {
        resolve(company)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function setCHDefaults (token, company) {
  return new Promise((resolve) => {
    if (company.company_number) {
      getCHCompany(token, company.company_number)
        .then((ch) => {
          if (!company.name) company.name = ch.name
          if (!company.registered_address_1) company.registered_address_1 = ch.registered_address_1
          if (!company.registered_address_2) company.registered_address_2 = ch.registered_address_2
          if (!company.registered_address_town) company.registered_address_town = ch.registered_address_town
          if (!company.registered_address_county) company.registered_address_county = ch.registered_address_county
          if (!company.registered_address_postcode) company.registered_address_postcode = ch.registered_address_postcode
          // if (!company.registered_address_country) company.registered_address_country = ch.registered_address_country.id
          company.business_type = ch.company.company_category
          resolve(company)
        })
    } else {
      resolve(company)
    }
  })
}

function saveCompany (token, company) {
  function saveParsedCompany (parsedCompany) {
    let method
    let url

    const companyToSave = Object.assign({}, parsedCompany)
    controllerUtils.flattenIdFields(companyToSave)
    controllerUtils.nullEmptyFields(companyToSave)

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

  delete company.is_headquarters
  delete company.trading_address_same_as_registered

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

function getCompanyInvestmentSummaryLite (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/company/${companyId}/investmentsummary/`)
}

function getCompanyInvestmentSummary (token, companyId) {
  let result
  return authorisedRequest(token, `${config.apiRoot}/company/${companyId}/investmentsummary/`)
  .then((summary) => {
    result = summary
    let promises = []
    if (result && result.investment_account_manager) {
      promises.push(authorisedRequest(null, `${config.apiRoot}/metadata/advisor/${result.client_relationship_manager}/`)
      .then((advisor) => {
        result.investment_account_manager = advisor
        return
      }))
    }
    if (result && result.client_relationship_manager) {
      promises.push(authorisedRequest(null, `${config.apiRoot}/metadata/advisor/${result.client_relationship_manager}/`)
      .then((advisor) => {
        result.client_relationship_manager = advisor
        return
      }))
    }

    if (promises.length === 0) {
      return result
    }

    return Promise.all(promises)
  })
  .then(() => {
    return result
  })
}

function getInvestmentProjectDetails (token, id) {
  const url = `${config.apiRoot}/investment/${id}/projectdetails/`
  return authorisedRequest(token, url)
}

function getCompanyInvestmentProjects (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/company/${companyId}/investmentprojects/`)
}

function saveDataToAPI (token, indata, url) {
  const method = 'POST'
  const data = Object.assign({}, indata)
  controllerUtils.flattenIdFields(data)
  controllerUtils.nullEmptyFields(data)
  return authorisedRequest(token, { url, method, body: data })
}

function saveCompanyInvestmentSummary (token, summary) {
  const url = `${config.apiRoot}/company/${summary.id}/investmentsummary/`
  return saveDataToAPI(token, summary, url)
}

function saveCreateInvestmentProject (token, project) {
  const url = `${config.apiRoot}/investment/${project.id}/createproject/`
  return saveDataToAPI(token, project, url)
}

function hydrateCompanyInvestments (token, companies) {
  const promises = []
  for (const co of companies) {
    if (co._type !== 'company_companieshousecompany') {
      promises.push(co) // company first
      promises.push(getCompanyInvestmentSummary(token, co._id))
      promises.push(getCompanyInvestmentProjects(token, co._id))
    }
  }
  return Promise.all(promises)
}

module.exports = {
  getCompany,
  saveCompany,
  getDitCompany,
  getDitCompanyLite,
  getCHCompany,
  archiveCompany,
  unarchiveCompany,
  getCompanyInvestmentSummary,
  getCompanyInvestmentSummaryLite,
  saveCompanyInvestmentSummary,
  saveCreateInvestmentProject,
  getCompanyInvestmentProjects,
  hydrateCompanyInvestments,
  getCompanyContacts,
  getCompanyInteractions,
  getInvestmentProjectDetails
}
