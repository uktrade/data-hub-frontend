const { sanitizeCheckboxes } = require('../../utils/transformers')

const transformInvestorRequirements = (body) => {
  return {
    deal_ticket_sizes: sanitizeCheckboxes(body.dealTicketSizes),
    investment_types: sanitizeCheckboxes(body.investmentTypes),
  }
}

module.exports = transformInvestorRequirements
