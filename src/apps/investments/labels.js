const roleAdviserTeam = {
  role: 'Role',
  adviser: 'Adviser',
  team: 'Team',
}

const labels = {
  detailsLabels: {
    view: {
      investor_company: 'Client',
      investment_type: 'Investment type',
      sector: 'Primary sector',
      business_activities: 'Business activity',
      client_contacts: 'Client contacts',
      description: 'Project description',
      anonymous_description: 'Anonymised description',
      estimated_land_date: 'Estimated land date',
      actual_land_date: 'Actual land date',
      investor_type: 'New or existing investor',
      level_of_involvement: 'Level of involvement',
      specific_programme: 'Specific investment programme',
    },
  },
  valueLabels: {
    view: {
      total_investment: 'Total investment',
      total_investment_hint: 'Enter the total number of GB pounds',
      foreign_equity_investment: 'Capital expenditure value',
      foreign_equity_investment_hint: 'Enter the total number of GB pounds',
      gross_value_added: 'Gross Value Added (GVA)',
      government_assistance: 'Government assistance',
      number_new_jobs: 'New jobs',
      average_salary: 'Average salary of new jobs',
      number_safeguarded_jobs: 'Safeguarded jobs',
      r_and_d_budget: 'R&D budget',
      associated_non_fdi_r_and_d_project: 'Non-FDI R&D project',
      new_tech_to_uk: 'New-to-world tech',
      export_revenue: 'Export revenue',
      likelihood_to_land: 'Likelihood to land',
    },
    edit: {
      government_assistance:
        'Is this project receiving government financial assistance?',
      number_new_jobs: 'Number of new jobs',
      number_safeguarded_jobs: 'Number of safeguarded jobs',
      r_and_d_budget:
        'Does this project have budget for a research and development?',
      non_fdi_r_and_d_budget:
        'Is this project associated with a non-FDI R&D project?',
      new_tech_to_uk:
        'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
      export_revenue:
        'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
      client_cannot_provide_total_investment:
        'Can client provide total investment value?',
      client_cannot_provide_total_investment_hint:
        'Includes capital, operational and R&D expenditure',
      client_cannot_provide_foreign_investment:
        'Can client provide capital expenditure value?',
      client_cannot_provide_foreign_investment_hint:
        'Foreign equity only, excluding operational and R&D expenditure',
      fdi_value: 'Project value',
      likelihood_to_land: 'Likelihood to land',
    },
  },
  requirementsLabels: {
    view: {
      strategic_drivers: 'Strategic drivers',
      client_requirements: 'Client requirements',
      competitor_countries: 'Competitor countries',
      uk_region_locations: 'Possible UK locations',
      actual_uk_regions: 'UK regions landed',
      uk_company: 'UK recipient company',
      delivery_partners: 'Delivery partners',
    },
    edit: {
      strategic_drivers: 'Strategic drivers behind this investment',
      client_considering_other_countries:
        'Is the client considering other countries?',
      uk_region_locations: 'Possible UK locations for this investment',
      site_decided:
        'Has the UK location (site address) for this investment been decided yet?',
      actual_uk_regions: 'UK regions landed',
      delivery_partners: 'Delivery partners',
      address_1: 'Street',
      address_2: 'Street 2',
      address_town: 'Town',
      address_postcode: 'Postcode',
    },
  },
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
    edit: {
      project_manager: 'Project Manager',
      project_assurance_adviser: 'Project Assurance Adviser',
    },
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
      likelihood_to_land: 'Likelihood to land',
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

labels.valueLabels.edit = Object.assign(
  {},
  labels.valueLabels.view,
  labels.valueLabels.edit
)
labels.requirementsLabels.edit = Object.assign(
  {},
  labels.requirementsLabels.view,
  labels.requirementsLabels.edit
)

module.exports = labels
