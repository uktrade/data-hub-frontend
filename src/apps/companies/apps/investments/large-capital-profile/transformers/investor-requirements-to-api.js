const { sanitiseUserSelection } = require('../../utils/transformers')

const transformInvestorRequirements = (body) => {
  return {
    deal_ticket_sizes: sanitiseUserSelection(body.dealTicketSizes),
    asset_classes_of_interest: [
      ...sanitiseUserSelection(body.energyAndInfrastructure),
      ...sanitiseUserSelection(body.realEstate),
    ],
    investment_types: sanitiseUserSelection(body.investmentTypes),
    minimum_return_rate: body.minimumReturnRate,
    time_horizons: sanitiseUserSelection(body.timeHorizons),
    restrictions: sanitiseUserSelection(body.restrictions),
    construction_risks: sanitiseUserSelection(body.constructionRisks),
    minimum_equity_percentage: body.minimumEquityPercentage,
    desired_deal_roles: sanitiseUserSelection(body.desiredDealRoles),
  }
}

module.exports = transformInvestorRequirements
