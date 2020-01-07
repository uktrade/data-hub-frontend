/* eslint-disable camelcase */
const { getInvestmentTypeDetails } = require('./shared')

function transformInvestmentFDIForView({
  investment_type,
  fdi_type,
  investor_company,
  uk_company,
}) {
  return {
    type_of_investment: getInvestmentTypeDetails(investment_type, fdi_type),
    foreign_investor: {
      name: investor_company.name,
      url: `/companies/${investor_company.id}`,
    },
    foreign_country: investor_company.address.country.name,
    uk_company: uk_company
      ? {
          name: uk_company.name,
          url: `/companies/${uk_company.id}`,
        }
      : null,
    investor_retain_voting_power: uk_company ? 'Yes' : 'No',
  }
}

module.exports = { transformInvestmentFDIForView }
