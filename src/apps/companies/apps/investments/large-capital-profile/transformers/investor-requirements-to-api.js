const { sanitizeCheckboxes } = require('../../utils/transformers')

const transformInvestorRequirements = (body) => {
  return {
    deal_ticket_sizes: sanitizeCheckboxes(body.dealTicketSizes),
    asset_classes_of_interest: sanitizeCheckboxes(body.energyAndInfrastructure),
    investment_types: sanitizeCheckboxes(body.investmentTypes),
    minimum_return_rate: body.minimumReturnRate,
    time_horizons: sanitizeCheckboxes(body.timeHorizons),
    restrictions: sanitizeCheckboxes(body.restrictions),
    construction_risks: sanitizeCheckboxes(body.constructionRisks),
    minimum_equity_percentage: body.minimumEquityPercentage,
    desired_deal_roles: sanitizeCheckboxes(body.desiredDealRoles),
  }
}

module.exports = transformInvestorRequirements
