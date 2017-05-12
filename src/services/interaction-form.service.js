const Q = require('q')
const interactionRepository = require('../repos/interaction.repo')
const { getPropertyId, nullEmptyFields } = require('../lib/property-helpers')

/**
 * Accepts an API interaction object and converts it into a format compatible with a HTML form
 *
 * @param {Object} interaction An interaction in API format
 * @returns {Object} A flattened copy of the interaction form in a format to use in a form
 */
function getInteractionAsFormData (interaction) {
  if (!interaction) return null

  let result = {
    id: interaction.id || null,
    company: getPropertyId(interaction, 'company'),
    contact: getPropertyId(interaction, 'contact'),
    interaction_type: getPropertyId(interaction, 'interaction_type'),
    subject: interaction.subject || null,
    notes: interaction.notes || null,
    date: interaction.date || null,
    dit_advisor: getPropertyId(interaction, 'dit_advisor'),
    service: getPropertyId(interaction, 'service'),
    dit_team: getPropertyId(interaction, 'dit_team')
  }

  result = nullEmptyFields(result)
  return result
}

/**
 * Accepts an interaction posted from a form and converts it into the API format before saving it.
 *
 * @param {string} token Session token to use for network calls
 * @param {Object} interactionForm A flat form format contact
 * @returns {Promise} Returns a promise that resolves to a copy of the saved contact in API
 * format after the server has saved it
 */
function saveInteractionForm (token, interactionForm) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const dataToSave = nullEmptyFields(interactionForm)

        // convert the date entered
        dataToSave.date = `${dataToSave.date_year}-${dataToSave.date_month}-${dataToSave.date_day}T00:00:00.00Z`
        delete dataToSave.date_year
        delete dataToSave.date_month
        delete dataToSave.date_day

        const savedInteraction = yield interactionRepository.saveInteraction(token, dataToSave)
        resolve(savedInteraction)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = {
  saveInteractionForm,
  getInteractionAsFormData
}
