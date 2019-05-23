const { sanitizeCheckboxes } = require('../../utils/transformers')

const transformInvestorRequirements = (body) => {
  return {
    deal_ticket_sizes: sanitizeCheckboxes(body.dealTicketSizes),
    investment_types: sanitizeCheckboxes(body.investmentTypes),
    time_horizons: sanitizeCheckboxes(body.timeHorizons),
    restrictions: sanitizeCheckboxes(body.restrictions),
    construction_risks: sanitizeCheckboxes(body.constructionRisks),
    desired_deal_roles: sanitizeCheckboxes(body.desiredDealRoles),
  }
}

module.exports = transformInvestorRequirements
