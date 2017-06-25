/* eslint camelcase: 0 */
const logger = require('../../../../config/logger')
const adviserRepository = require('../../../repos/adviser.repo')
const interactionRepository = require('../../interactions/interactions.repo')
const metadataRepository = require('../../../repos/metadata.repo')
const serviceDeliveryRepository = require('../../service-deliveries/service-deliveries.repo')

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
  return new Promise(async (resolve, reject) => {
    try {
      resolve(contact)
    } catch (error) {
      logger.error(error)
      reject(error)
    }
  })
}

function getContactInteractionsAndServiceDeliveries (token, contactId) {
  return new Promise(async (resolve, reject) => {
    try {
      const adviserHash = {}

      const interactions = await interactionRepository.getInteractionsForContact(token, contactId)
      const serviceDeliveries = await serviceDeliveryRepository.getServiceDeliveriesForContact(token, contactId)
      const serviceOffers = await metadataRepository.getServiceOffers(token)

      // Build a list of advisers we use in interactions, to help populate service deliveries
      for (const interaction of interactions) {
        adviserHash[interaction.dit_adviser.id] = interaction.dit_adviser
      }

      // Go fetch any advisers we haven't got yet for service deliveries
      for (const serviceDelivery of serviceDeliveries) {
        const dit_adviser = serviceDelivery.relationships.dit_adviser.data.id
        if (!adviserHash[dit_adviser]) {
          adviserHash[dit_adviser] = await adviserRepository.getAdviser(token, dit_adviser)
        }
      }

      // Parse the service delivery results into something that can be displayed
      const parsedServiceDeliveries = serviceDeliveries.map((serviceDelivery) => {
        return Object.assign({},
          serviceDelivery.attributes,
          {
            id: serviceDelivery.id,
            interaction_type: { id: null, name: 'Service delivery' },
            dit_adviser: adviserHash[serviceDelivery.relationships.dit_adviser.data.id],
            service: serviceOffers.find((option) => option.id === serviceDelivery.relationships.service.data.id),
            dit_team: metadataRepository.teams.find((option) => option.id === serviceDelivery.relationships.dit_team.data.id),
          })
      })

      const combinedIteractions = [...interactions, ...parsedServiceDeliveries]
      resolve(combinedIteractions)
    } catch (error) {
      logger.error(error)
      reject(error)
    }
  })
}

module.exports = { getInflatedContact, getContactInteractionsAndServiceDeliveries }
