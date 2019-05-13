const { sanitizeCheckboxes } = require('../../utils/transformers')

const transformInvestorRequirements = (body) => {
  return {
    deal_ticket_sizes: sanitizeCheckboxes(body.dealTicketSizes),
  }
}

module.exports = transformInvestorRequirements
