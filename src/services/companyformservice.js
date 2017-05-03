/* eslint camelcase: 0, no-unused-expressions: 0 */

const Q = require('q')
const { getPropertyId, nullEmptyFields, convertYesNoToBoolean } = require('../lib/propertyhelpers')
const companyRepository = require('../repositorys/companyrepository')
const metadataRepository = require('../repositorys/metadatarepository')

function getLtdCompanyAsFormData (company) {
  if (!company) {
    return null
  }

  let result = {
    id: company.id,
    company_number: company.company_number,
    business_type: getPropertyId(company, 'business_type'),
    uk_based: 'yes',
    name: company.name,
    registered_address_1: company.registered_address_1,
    registered_address_2: company.registered_address_2,
    registered_address_3: company.registered_address_3,
    registered_address_4: company.registered_address_4,
    registered_address_town: company.registered_address_town,
    registered_address_county: company.registered_address_county,
    registered_address_postcode: company.registered_address_postcode,
    registered_address_country: company.registered_address_country.id,
    trading_address_1: company.trading_address_1,
    trading_address_2: company.trading_address_2,
    trading_address_3: company.trading_address_3,
    trading_address_4: company.trading_address_4,
    trading_address_town: company.trading_address_town,
    trading_address_county: company.trading_address_county,
    trading_address_postcode: company.trading_address_postcode,
    trading_address_country: company.trading_address_country.id,
    uk_region: getPropertyId(company, 'uk_region'),
    headquarter_type: getPropertyId(company, 'headquarter_type'),
    sector: getPropertyId(company, 'sector'),
    website: company.website,
    description: company.description,
    employee_range: getPropertyId(company, 'employee_range'),
    turnover_range: getPropertyId(company, 'turnover_range')
  }

  result = nullEmptyFields(result)
  return result
}

function getUkOtherCompanyAsFormData (company) {
  if (!company) {
    return null
  }

  let result = {
    id: company.id,
    business_type: getPropertyId(company, 'business_type'),
    uk_based: 'yes',
    name: company.name,
    registered_address_1: company.registered_address_1,
    registered_address_2: company.registered_address_2,
    registered_address_3: company.registered_address_3,
    registered_address_4: company.registered_address_4,
    registered_address_town: company.registered_address_town,
    registered_address_county: company.registered_address_county,
    registered_address_postcode: company.registered_address_postcode,
    registered_address_country: company.registered_address_country.id,
    trading_address_1: company.trading_address_1,
    trading_address_2: company.trading_address_2,
    trading_address_3: company.trading_address_3,
    trading_address_4: company.trading_address_4,
    trading_address_town: company.trading_address_town,
    trading_address_county: company.trading_address_county,
    trading_address_postcode: company.trading_address_postcode,
    trading_address_country: company.trading_address_country.id,
    uk_region: getPropertyId(company, 'uk_region'),
    headquarter_type: getPropertyId(company, 'headquarter_type'),
    sector: getPropertyId(company, 'sector'),
    website: company.website,
    description: company.description,
    employee_range: getPropertyId(company, 'employee_range'),
    turnover_range: getPropertyId(company, 'turnover_range')
  }

  result = nullEmptyFields(result)
  return result
}

function getForeignCompanyAsFormData (company) {
  if (!company) {
    return null
  }

  let result = {
    id: company.id,
    business_type: getPropertyId(company, 'business_type'),
    uk_based: 'no',
    name: company.name,
    registered_address_1: company.registered_address_1,
    registered_address_2: company.registered_address_2,
    registered_address_3: company.registered_address_3,
    registered_address_4: company.registered_address_4,
    registered_address_town: company.registered_address_town,
    registered_address_county: company.registered_address_county,
    registered_address_postcode: company.registered_address_postcode,
    registered_address_country: company.registered_address_country.id,
    trading_address_1: company.trading_address_1,
    trading_address_2: company.trading_address_2,
    trading_address_3: company.trading_address_3,
    trading_address_4: company.trading_address_4,
    trading_address_town: company.trading_address_town,
    trading_address_county: company.trading_address_county,
    trading_address_postcode: company.trading_address_postcode,
    trading_address_country: company.trading_address_country.id,
    headquarter_type: getPropertyId(company, 'headquarter_type'),
    sector: getPropertyId(company, 'sector'),
    website: company.website,
    description: company.description,
    employee_range: getPropertyId(company, 'employee_range'),
    turnover_range: getPropertyId(company, 'turnover_range')
  }

  result = nullEmptyFields(result)
  return result
}

function getDefaultLtdFormForCH (companies_house_data) {
  if (!companies_house_data) {
    return null
  }

  const business_type = metadataRepository.getIdForName(metadataRepository.businessTypeOptions, companies_house_data.company_category)

  let result = {
    company_number: companies_house_data.company_number,
    business_type: (business_type && business_type.id) ? business_type.id : null,
    uk_based: 'yes',
    name: companies_house_data.name,
    registered_address_1: companies_house_data.registered_address_1,
    registered_address_2: companies_house_data.registered_address_2,
    registered_address_3: companies_house_data.registered_address_3,
    registered_address_4: companies_house_data.registered_address_4,
    registered_address_town: companies_house_data.registered_address_town,
    registered_address_county: companies_house_data.registered_address_county,
    registered_address_postcode: companies_house_data.registered_address_postcode,
    registered_address_country: companies_house_data.registered_address_country.id
  }

  result = nullEmptyFields(result)
  return result
}

function saveCompanyForm (token, companyForm) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        let dataToSave = convertYesNoToBoolean(companyForm)
        dataToSave = nullEmptyFields(dataToSave)
        const savedContact = yield companyRepository.saveCompany(token, dataToSave)
        resolve(savedContact)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { getLtdCompanyAsFormData, saveCompanyForm, getDefaultLtdFormForCH, getUkOtherCompanyAsFormData, getForeignCompanyAsFormData }
