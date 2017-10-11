const { getPropertyId, nullEmptyFields } = require('../../../lib/property-helpers')

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
    communication_channel: getPropertyId(interaction, 'communication_channel'),
    subject: interaction.subject || null,
    notes: interaction.notes || null,
    date: interaction.date || null,
    dit_adviser: getPropertyId(interaction, 'dit_adviser'),
    service: getPropertyId(interaction, 'service'),
    dit_team: getPropertyId(interaction, 'dit_team'),
  }

  result = nullEmptyFields(result)
  return result
}

module.exports = {
  getInteractionAsFormData,
}
