/* eslint camelcase: 0 */
const Q = require('q')
const winston = require('winston')
const advisorRepository = require('../repositorys/advisorrepository')
const companyRepository = require('../repositorys/companyrepository')
const serviceDeliveryRepository = require('../repositorys/servicedeliveryrepository')
const interactionDataService = require('./interactiondataservice')

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

        // Parse the service delivery results into something that can be displayed
        const parsedServiceDeliverys = serviceDeliverys.map((serviceDelivery) => {
          return {
            id: serviceDelivery.id,
            date: serviceDelivery.attributes.date,
            created_on: serviceDelivery.attributes.date,
            notes: serviceDelivery.attributes.notes,
            subject: serviceDelivery.attributes.subject,
            contact: getContactInCompanyObject(company, serviceDelivery.relationships.contact.data.id),
            interaction_type: { id: null, name: 'Service delivery' },
            dit_advisor: advisorHash[serviceDelivery.relationships.dit_advisor.data.id]
          }
        })

        // Parse the interaction into something that can be displayed
        const parsedInteractions = company.interactions.map((interaction) => {
          return {
            id: interaction.id,
            date: interaction.date,
            created_on: interaction.date,
            notes: interaction.notes,
            subject: interaction.subject,
            contact: getContactInCompanyObject(company, interaction.contact),
            interaction_type: interactionDataService.getInteractionType(interaction.interaction_type),
            dit_advisor: advisorHash[interaction.dit_advisor]
          }
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

module.exports = { getInflatedDitCompany, getCompanyForSource }
