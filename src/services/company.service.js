/* eslint camelcase: 0 */
const Q = require('q')
const winston = require('winston')
const advisorRepository = require('../repos/advisor.repo')
const companyRepository = require('../repos/company.repo')
const metadataRepository = require('../repos/metadata.repo')
const serviceDeliveryRepository = require('../repos/service-delivery.repo')
const interactionDataService = require('./interaction-data.service')
const { genCSRF } = require('../lib/controller-utils')
const { getFormattedAddress } = require('../lib/address')

function getContactInCompanyObject (company, contactId) {
  for (const contact of company.contacts) {
    if (contact.id === contactId) return contact
  }
  return contactId
}

function getInflatedDitCompany (token, id) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const advisorHash = {}
        const company = yield companyRepository.getDitCompany(token, id)
        const serviceDeliverys = yield serviceDeliveryRepository.getServiceDeliverysForCompany(token, company.id)

        // Build a list of advisors to lookup
        for (const interaction of company.interactions) {
          advisorHash[interaction.dit_advisor] = true
        }
        for (const serviceDelivery of serviceDeliverys) {
          advisorHash[serviceDelivery.relationships.dit_advisor.data.id] = true
        }

        // get the related adviors
        for (const advisorId of Object.keys(advisorHash)) {
          const advisor = yield advisorRepository.getAdvisor(token, advisorId)
          advisorHash[advisor.id] = advisor
        }

        const serviceOffers = yield metadataRepository.getServiceOffers(token)

        // Parse the service delivery results to expand some of the properties
        const parsedServiceDeliverys = serviceDeliverys.map((serviceDelivery) => {
          return Object.assign({}, {id: serviceDelivery.id}, serviceDelivery.attributes, {
            contact: getContactInCompanyObject(company, serviceDelivery.relationships.contact.data.id),
            interaction_type: { id: null, name: 'Service delivery' },
            dit_advisor: advisorHash[serviceDelivery.relationships.dit_advisor.data.id],
            service: serviceOffers.find((option) => option.id === serviceDelivery.relationships.service.data.id),
            dit_team: metadataRepository.teams.find((option) => option.id === serviceDelivery.relationships.dit_team.data.id)
          })
        })

        // Parse the interaction results to expand some of the properties
        const parsedInteractions = company.interactions.map((interaction) => {
          return Object.assign({}, interaction, {
            contact: getContactInCompanyObject(company, interaction.contact),
            interaction_type: interactionDataService.getInteractionType(interaction.interaction_type),
            dit_advisor: advisorHash[interaction.dit_advisor],
            service: serviceOffers.find((option) => option.id === interaction.service),
            dit_team: metadataRepository.teams.find((option) => option.id === interaction.dit_team)
          })
        })

        const combinedIteractions = [...parsedInteractions, ...parsedServiceDeliverys]

        company.interactions = combinedIteractions
        resolve(company)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

function getCompanyForSource (token, id, source) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        if (source === 'company_companieshousecompany') {
          const companies_house_data = yield companyRepository.getCHCompany(token, id)
          resolve({
            company_number: id,
            companies_house_data,
            contacts: [],
            interactions: []
          })
          return
        }

        const company = yield getInflatedDitCompany(token, id)
        resolve(company)
      } catch (error) {
        reject(error)
      }
    })
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
  const companyPath = '/company/view'
  const businessType = company.business_type && company.business_type.name.toLowerCase()
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
    if (company.alias && company.alias.length > 0) {
      return company.alias
    }
    return company.name
  } else {
    return company.companies_house_data.name
  }
}

function getCommonTitlesAndlinks (req, res, company) {
  genCSRF(req, res)
  res.locals.headingName = getHeadingName(company)
  res.locals.headingAddress = getHeadingAddress(company)
  res.locals.companyUrl = buildCompanyUrl(company)
}

module.exports = { getInflatedDitCompany, getCompanyForSource, buildCompanyUrl, getCommonTitlesAndlinks, getHeadingAddress }
