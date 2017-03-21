/* eslint camelcase: 0 */
const Q = require('q')
const winston = require('winston')
const companyRepository = require('../repositorys/companyrepository')
const contactRepository = require('../repositorys/contactrepository')
const metadataRepository = require('../repositorys/metadatarepository')
const interactionRepository = require('../repositorys/interactionrepository')
const advisorRepository = require('../repositorys/advisorrepository')

function getInteractionType (interactionTypeId) {
  for (const interactionType of metadataRepository.interactionTypeOptions) {
    if (interactionType.id === interactionTypeId) {
      return interactionType
    }
  }
  return null
}

function getHydratedInteraction (token, interactionId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        const interaction = yield interactionRepository.getInteraction(token, interactionId)
        interaction.company = yield companyRepository.getDitCompany(token, interaction.company.id)
        resolve(interaction)
      } catch (error) {
        reject(error)
      }
    })
  })
}

function createBlankInteractionForContact (token, dit_advisor, interaction_type, contactId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        const contact = yield contactRepository.getContact(token, contactId)
        const company = yield companyRepository.getDitCompany(token, contact.company.id)
        const interaction_type_obj = getInteractionType(interaction_type)
        resolve({
          contact,
          company,
          interaction_type: interaction_type_obj,
          dit_advisor,
          date: new Date(),
          service: {
            id: null,
            name: null
          },
          dit_team: {
            id: null,
            name: null
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

function createBlankInteractionForCompany (token, dit_advisor, interaction_type, companyId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        const company = yield companyRepository.getDitCompany(token, companyId)
        const interaction_type_obj = getInteractionType(interaction_type)
        resolve({
          company,
          interaction_type: interaction_type_obj,
          dit_advisor,
          date: new Date(),
          service: {
            id: null,
            name: null
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

function convertFormBodyBackToInteraction (token, flatInteraction) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        const company = yield companyRepository.getDitCompany(token, flatInteraction.company)
        const interaction_type = getInteractionType(flatInteraction.interaction_type)

        const result = {
          company,
          interaction_type,
          subject: flatInteraction.subject,
          notes: flatInteraction.notes,
          date: flatInteraction.date,
          service: { id: flatInteraction.service },
          dit_team: { id: flatInteraction.dit_team }
        }

        if (flatInteraction.contact) {
          result.contact = yield contactRepository.getBriefContact(token, flatInteraction.contact)
        } else {
          result.contact = { id: null }
        }

        if (flatInteraction.dit_advisor) {
          result.dit_advisor = yield advisorRepository.getAdvisor(token, flatInteraction.dit_advisor)
        } else {
          result.dit_advisor = { id: null }
        }

        if (flatInteraction.id) {
          result.id = flatInteraction.id
        }
        resolve(result)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

module.exports = {
  getInteractionType,
  getHydratedInteraction,
  createBlankInteractionForContact,
  createBlankInteractionForCompany,
  convertFormBodyBackToInteraction
}
