const labels = {
  detailsLabels: {
    view: {
      investor_company: 'Client',
      investment_type: 'Type of investment',
      sector: 'Primary sector',
      business_activities: 'Business activity',
      description: 'Project description',
      nda_signed: 'Non-disclosure agreement',
      estimated_land_date: 'Estimated land date',
    },
  },
  valueLabels: {
    view: {
      total_investment: 'Total investment',
      foreign_equity_investment: 'Foreign equity investment',
      government_assistance: 'Government assistance',
      number_new_jobs: 'New jobs',
      average_salary: 'Average salary of new jobs',
      number_safeguarded_jobs: 'Safeguarded jobs',
      r_and_d_budget: 'R&D budget',
      non_fdi_r_and_d_budget: 'Non-FDI R&D project',
      new_tech_to_uk: 'New-to-world tech',
      export_revenue: 'Export revenue',
    },
    edit: {
      government_assistance: 'Is this project receiving government financial assistance?',
      number_new_jobs: 'Number of new jobs',
      number_safeguarded_jobs: 'Number of safeguarded jobs',
      r_and_d_budget: 'Does this project have budget for a research and development?',
      non_fdi_r_and_d_budget: 'Is this project associated with a non-FDI R&D project?',
      new_tech_to_uk: 'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
      export_revenue: 'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
      client_cannot_provide_total_investment: 'Client cannot provide this information',
      client_cannot_provide_foreign_investment: 'Client cannot provide this information',
    },
  },
  requirementsLabels: {
    view: {
      strategic_drivers: 'Main strategic driver',
      client_requirements: 'Client requirements',
      competitor_countries: 'Competitor countries',
      uk_region_locations: 'Possible UK locations',
      uk_company: 'UK recipient company',
    },
    edit: {
      strategic_drivers: 'Main strategic driver behind this investment',
      client_considering_other_countries: 'Is the client considering other countries?',
      uk_region_locations: 'Possible UK location for this investment',
      site_decided: 'Has the UK location (site address) for this investment been decided yet?',
    },
  },
  interactionsLabels: {
    edit: {
      interaction_type: 'Interaction Type',
      subject: 'Subject',
      notes: 'Interaction notes',
      contact: 'Interaction contact',
      date: 'Date of interaction',
      dit_adviser: 'DIT adviser',
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
      type_of_investment: 'Type of investment',
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
      investment_land_date: 'Land date',
    },
  },
  projectManagementEditLabels: {
    project_manager: 'Project manager',
    project_assurance_adviser: 'Project assurance adviser',
  },
  briefInvestmentSummaryLabels: {
    sector: 'Primary sector',
    investor_company: 'Client company',
    website: 'Website',
    account_tier: 'Account tier',
    uk_region_locations: 'Possible UK locations',
    competitor_countries: 'Competitor countries',
    estimated_land_date: 'Estimated land date',
    total_investment: 'Total investment',
  },
}

labels.valueLabels.edit = Object.assign({}, labels.valueLabels.view, labels.valueLabels.edit)
labels.requirementsLabels.edit = Object.assign({}, labels.requirementsLabels.view, labels.requirementsLabels.edit)

module.exports = labels
