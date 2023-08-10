const roleAdviserTeam = {
  role: 'Role',
  adviser: 'Adviser',
  team: 'Team',
}

const labels = {
  evaluationValueLabels: {
    view: {
      sector_name: 'Primary sector',
      total_investment: 'Total investment',
      number_new_jobs: 'New jobs',
      average_salary: 'Average salary of new jobs',
      r_and_d_budget: 'R&D budget',
      non_fdi_r_and_d_budget: 'Non-FDI R&D project',
      new_tech_to_uk: 'New-to-world tech',
      account_tier: 'Account tier',
      business_activities: 'New GHQ/EHQ',
      export_revenue: 'Export revenue',
    },
  },
  evaluationFdiLabels: {
    view: {
      type_of_investment: 'Investment type',
      foreign_investor: 'Foreign investor',
      foreign_country: 'Foreign country',
      uk_company: 'UK company',
      foreign_equity_investment: 'Foreign equity investment',
      investor_retain_voting_power: 'Investor retains 10% voting power',
      number_new_jobs: 'New jobs',
      number_safeguarded_jobs: 'Safeguarded jobs',
    },
  },
  evaluationLandingLabels: {
    view: {
      uk_company: 'UK company',
      company_number: 'Companies House Number',
      registered_address: 'Registered Address',
      actual_land_date: 'Actual land date',
    },
  },
  projectManagementLabels: {
    view: roleAdviserTeam,
  },
  briefInvestmentSummaryLabels: {
    view: {
      sector: 'Primary sector',
      investor_company: 'Client company',
      website: 'Website',
      account_tier: 'Account tier',
      uk_region_locations: 'Possible UK locations',
      competitor_countries: 'Competitor countries',
      estimated_land_date: 'Estimated land date',
      total_investment: 'Total investment',
    },
  },
  collectionFilterLabels: {
    edit: {
      adviser: 'Adviser',
      stage: 'Stage',
      investment_type: 'Investment type',
      sector_descends: 'Sector',
      sector: 'Sector',
      total_investment: 'Investment value',
      estimated_land_date_before: 'Estimated land date before',
      estimated_land_date_after: 'Estimated land date after',
      actual_land_date_before: 'Actual land date before',
      actual_land_date_after: 'Actual land date after',
      level_of_involvement_simplified: 'Involvement level',
      status: 'Status',
      uk_region_location: 'UK Region',
      investor_company_country: 'Country of company origin',
      likelihood_to_land: 'Likelihood of landing',
    },
  },
  clientRelationshipManagementLabels: {
    view: roleAdviserTeam,
    edit: {
      client_relationship_manager: 'Client Relationship Manager',
      global_account_manager: 'Global Account Manager',
    },
  },
  teamMembersLabels: {
    view: roleAdviserTeam,
    edit: roleAdviserTeam,
  },
  investmentProjectMetaItemLabels: {
    stage: 'Stage',
    investment_type: 'Investment type',
    investor_company: 'Investor',
    estimated_land_date: 'Estimated land date',
    sector: 'Sector',
  },
}

module.exports = labels
