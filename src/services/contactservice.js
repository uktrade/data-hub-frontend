/* eslint camelcase: 0 */
const Q = require('q')
const winston = require('winston')
const advisorRepository = require('../repositorys/advisorrepository')
const contactRepository = require('../repositorys/contactrepository')
const serviceDeliveryRepository = require('../repositorys/servicedeliveryrepository')
const interactionService = require('./interactionservice')

function getInflatedContact (token, id) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        const advisorHash = {}
        const contact = yield contactRepository.getContact(token, id)
        const serviceDeliverys = yield serviceDeliveryRepository.getServiceDeliverysForContact(token, contact.id)

        // Build a list of advisors to lookup
        for (const interaction of contact.interactions) {
          advisorHash[interaction.dit_advisor] = true
        }
        for (const serviceDelivery of serviceDeliverys.data) {
          advisorHash[serviceDelivery.relationships.dit_advisor.data.id] = true
        }

        // get the related adviors
        for (const advisorId of Object.keys(advisorHash)) {
          const advisor = yield advisorRepository.getAdvisor(token, advisorId)
          advisorHash[advisor.id] = advisor
        }

        // Parse the service delivery results into something that can be displayed
        const parsedServiceDeliverys = serviceDeliverys.data.map((serviceDelivery) => {
          return {
            id: serviceDelivery.id,
            date: serviceDelivery.attributes.date,
            created_on: serviceDelivery.attributes.date,
            notes: serviceDelivery.attributes.notes,
            contact: { id: contact.id, first_name: contact.first_name, last_name: contact.last_name },
            subject: serviceDelivery.attributes.subject,
            interaction_type: { id: null, name: 'Service delivery' },
            dit_advisor: advisorHash[serviceDelivery.relationships.dit_advisor.data.id]
          }
        })

        // Parse the interaction into something that can be displayed
        const parsedInteractions = contact.interactions.map((interaction) => {
          return {
            id: interaction.id,
            date: interaction.date,
            created_on: interaction.date,
            notes: interaction.notes,
            contact: { id: contact.id, first_name: contact.first_name, last_name: contact.last_name },
            subject: interaction.subject,
            interaction_type: interactionService.getInteractionType(interaction.interaction_type),
            dit_advisor: advisorHash[interaction.dit_advisor]
          }
        })

        const combinedIteractions = [...parsedInteractions, ...parsedServiceDeliverys]
        contact.interactions = combinedIteractions
        resolve(contact)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

module.exports = { getInflatedContact }
