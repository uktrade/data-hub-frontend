const { getPropertyId, nullEmptyFields } = require('../../../lib/property-helpers')

/**
 * Accepts an API proposition object and converts it into a format compatible with a HTML form
 *
 * @param {Object} proposition An proposition in API format
 * @returns {Object} A flattened copy of the proposition form in a format to use in a form
 */
function getPropositionAsFormData (proposition) {
  if (!proposition) return null

  let result = {
    id: proposition.id || null,
    company: getPropertyId(proposition, 'company'),
    contact: getPropertyId(proposition, 'contact'),
    communication_channel: getPropertyId(proposition, 'communication_channel'),
    subject: proposition.subject || null,
    notes: proposition.notes || null,
    date: proposition.date || null,
    dit_adviser: getPropertyId(proposition, 'dit_adviser'),
    service: getPropertyId(proposition, 'service'),
    dit_team: getPropertyId(proposition, 'dit_team'),
  }

  result = nullEmptyFields(result)
  return result
}

module.exports = {
  getPropositionAsFormData,
}
