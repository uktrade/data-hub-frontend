function transformMetadataIntoOption (item) {
  return {
    value: item.id,
    label: item.name,
  }
}

function transformInvestmentProjectIntoListItem ({
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
        isTag: true,
      },
      {
        name: 'investment_type',
        label: 'Investment type',
        value: investment_type,
        tagModifier: 'alt',
        isTag: true,
      },
      {
        name: 'investor_company',
        label: 'Investor',
        value: investor_company,
        isTag: false,
      }, {
        name: 'estimated_land_date',
        label: 'Estimated to land',
        value: estimated_land_date,
        isInert: true,
        isTag: false,
      }, {
        name: 'sector',
        label: 'Sector',
        value: sector,
        isTag: false,
      },
    ],
  }
}

module.exports = {
  transformMetadataIntoOption,
  transformInvestmentProjectIntoListItem,
}
