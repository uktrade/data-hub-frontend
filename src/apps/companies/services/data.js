/* eslint camelcase: 0 */
const { get } = require('lodash')
const logger = require('../../../../config/logger')
const adviserRepository = require('../../adviser/repos')
const companyRepository = require('../repos')
const metadataRepository = require('../../../lib/metadata')
const serviceDeliveryRepository = require('../../service-deliveries/repos')
const interactionsRepository = require('../../interactions/repos')
const { getFormattedAddress } = require('../../../lib/address')

function getContactInCompanyObject (company, contactId) {
  for (const contact of company.contacts) {
    if (contact.id === contactId) return contact
  }
  return contactId
}

function getInflatedDitCompany (token, id) {
  return new Promise(async (resolve, reject) => {
    try {
      const adviserHash = {}
      const company = await companyRepository.getDitCompany(token, id)
      const serviceDeliveries = await serviceDeliveryRepository.getServiceDeliveriesForCompany(token, company.id)
      const interactions = await interactionsRepository.getInteractionsForCompany(token, company.id)

      for (const serviceDelivery of serviceDeliveries) {
        adviserHash[serviceDelivery.relationships.dit_adviser.data.id] = true
      }

      // get the related advisers
      for (const adviserId of Object.keys(adviserHash)) {
        const adviser = await adviserRepository.getAdviser(token, adviserId)
        adviserHash[adviser.id] = adviser
      }

      const services = await metadataRepository.getServices(token)

      // Parse the service delivery results to expand some of the properties
      const parsedServiceDeliveries = serviceDeliveries.map((serviceDelivery) => {
        return Object.assign({}, { id: serviceDelivery.id }, serviceDelivery.attributes, {
          contact: getContactInCompanyObject(company, serviceDelivery.relationships.contact.data.id),
          interaction_type: { id: null, name: 'Service delivery' },
          dit_adviser: adviserHash[serviceDelivery.relationships.dit_adviser.data.id],
          service: services.find((option) => option.id === serviceDelivery.relationships.service.data.id),
          dit_team: metadataRepository.teams.find((option) => option.id === serviceDelivery.relationships.dit_team.data.id),
        })
      })

      const combinedInteractions = [...interactions, ...parsedServiceDeliveries]

      company.interactions = combinedInteractions
      resolve(company)
    } catch (error) {
      logger.error(error)
      reject(error)
    }
  })
}

/**
 * Pass an API formatted company record in and return a path to view that company depending on company type
 *
 * @param {Object} company
 *
 * @returns {string} urlPath
 */
function buildCompanyUrl (company) {
  const companyPath = '/companies/view'
  const businessType = get(company, 'business_type.name', '').toLowerCase()
  let urlPath

  if (!company.uk_based) {
    urlPath = `${companyPath}/foreign/${company.id}`
  } else if (businessType.includes('limited company')) {
    urlPath = `${companyPath}/ltd/${company.id}`
  } else {
    urlPath = `${companyPath}/ukother/${company.id}`
  }

  return urlPath
}

function getHeadingAddress (company) {
  // If this is a CDMS company
  const cdmsTradingAddress = getFormattedAddress(company, 'trading')
  if (cdmsTradingAddress) {
    return cdmsTradingAddress
  }

  if (company.companies_house_data && company.companies_house_data !== null) {
    return getFormattedAddress(company.companies_house_data, 'registered')
  }

  return getFormattedAddress(company, 'registered')
}

function getHeadingName (company) {
  if (company.id) {
    if (company.trading_name && company.trading_name.length > 0) {
      return company.trading_name
    }
    return company.name
  } else {
    return company.companies_house_data.name
  }
}

function getCommonTitlesAndlinks (req, res, company) {
  res.locals.headingName = getHeadingName(company)
  res.locals.headingAddress = getHeadingAddress(company)
  res.locals.companyUrl = buildCompanyUrl(company)
}

module.exports = {
  getInflatedDitCompany,
  buildCompanyUrl,
  getCommonTitlesAndlinks,
  getHeadingAddress,
}
