/* eslint camelcase: 0 */
const Q = require('q')
const winston = require('winston')
const advisorRepository = require('../repositorys/advisorrepository')
const companyRepository = require('../repositorys/companyrepository')
const metadataRepository = require('../repositorys/metadatarepository')
const serviceDeliveryRepository = require('../repositorys/servicedeliveryrepository')
const interactionDataService = require('./interactiondataservice')
const companyFormattingService = require('./companyformattingservice')

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
 * Pass an API formatted company record in and return a url to view that company
 * depending on it's type
 *
 * @param {Object} company
 *
 * @returns {string} url
 */
function getViewCompanyLink (company) {
  if (!company.uk_based) {
    return `/company/view/foreign/${company.id}`
  } else if (company.business_type.name.toLowerCase() === 'private limited company' || company.business_type.name.toLowerCase() === 'public limited company') {
    return `/company/view/ltd/${company.id}`
  } else {
    return `/company/view/ukother/${company.id}`
  }
}

function getCommonTitlesAndlinks (company, res) {
  res.locals.headingName = companyFormattingService.getHeadingName(company)
  res.locals.headingAddress = companyFormattingService.getHeadingAddress(company)
  res.locals.companyUrl = getViewCompanyLink(company)
}

module.exports = { getInflatedDitCompany, getCompanyForSource, getViewCompanyLink, getCommonTitlesAndlinks }
