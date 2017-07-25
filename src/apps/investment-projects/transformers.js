function transformInvestmentProjectToListItem ({
  id,
  name,
  type,
  project_code,
  stage,
  investment_type,
  investor_company,
  estimated_land_date,
  sector,
 }) {
  return {
    id,
    name,
    type: 'investment-project',
    code: project_code,
    meta: [
      {
        name: 'stage',
        label: 'Stage',
        value: stage,
        isBadge: true,
      },
      {
        name: 'investment_type',
        label: 'Investment type',
        value: investment_type,
        badgeModifier: 'secondary',
        isBadge: true,
      },
      {
        name: 'investor_company',
        label: 'Investor',
        value: investor_company,
        isBadge: false,
      }, {
        name: 'estimated_land_date',
        label: 'Estimated to land',
        value: estimated_land_date,
        isInert: true,
        isBadge: false,
      }, {
        name: 'sector',
        label: 'Sector',
        value: sector,
        isBadge: false,
      },
    ],
  }
}

module.exports = {
  transformInvestmentProjectToListItem,
}
