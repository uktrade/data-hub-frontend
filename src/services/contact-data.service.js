/* eslint camelcase: 0 */
const Q = require('q')
const winston = require('winston')
const advisorRepository = require('../repos/advisor.repo')
const interactionRepository = require('../repos/interaction.repo')
const serviceDeliveryRepository = require('../repos/service-delivery.repo')

/**
 * Accepts an API contact object and inflates it to pull in related contact data but
 * does not get interactions and service deliveries.
 *
 * PLEASE NOTE - This function is a placeholder for when we switch to V2 API
 *
 * @param {string} token A session token to be used when calling the API server
 * @param {Object} contact A raw API contact object to be inflated
 * @returns {Object} Returns a promise which in turn resolves with an object
 * representing an inflated contact or rejects with an error
 */
function getInflatedContact (token, contact) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        resolve(contact)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

function getContactInteractionsAndServiceDeliveries (token, contactId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const advisorHash = {}

        const interactions = yield interactionRepository.getInteractionsForContact(token, contactId)
        const serviceDeliverys = yield serviceDeliveryRepository.getServiceDeliverysForContact(token, contactId)

        // Build a list of advisors we use in interactions, to help populate service deliveries
        for (const interaction of interactions) {
          advisorHash[interaction.dit_advisor.id] = interaction.dit_advisor
        }

        // Go fetch any advisors we haven't got yet for service deliveries
        for (const serviceDelivery of serviceDeliverys) {
          const dit_advisor = serviceDelivery.relationships.dit_advisor.data.id
          if (!advisorHash[dit_advisor]) {
            advisorHash[dit_advisor] = yield advisorRepository.getAdvisor(token, dit_advisor)
          }
        }

        // Parse the service delivery results into something that can be displayed
        const parsedServiceDeliverys = serviceDeliverys.map((serviceDelivery) => {
          return {
            id: serviceDelivery.id,
            date: serviceDelivery.attributes.date,
            created_on: serviceDelivery.attributes.date,
            notes: serviceDelivery.attributes.notes,
            subject: serviceDelivery.attributes.subject,
            interaction_type: { id: null, name: 'Service delivery' },
            dit_advisor: advisorHash[serviceDelivery.relationships.dit_advisor.data.id]
          }
        })

        // Parse the interaction into something that can be displayed
        const parsedInteractions = interactions.map((interaction) => {
          return {
            id: interaction.id,
            date: interaction.date,
            created_on: interaction.date,
            notes: interaction.notes,
            subject: interaction.subject,
            interaction_type: interaction.interaction_type,
            dit_advisor: interaction.dit_advisor
          }
        })

        const combinedIteractions = [...parsedInteractions, ...parsedServiceDeliverys]
        resolve(combinedIteractions)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

module.exports = { getInflatedContact, getContactInteractionsAndServiceDeliveries }
