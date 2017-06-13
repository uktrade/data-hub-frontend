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
      average_salary: 'Average salary',
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
    },
  },
  requirementsLabels: {
    view: {
      strategic_drivers: 'Main strategic drivers',
      client_requirements: 'Client requirements',
      competitor_countries: 'Competitor countries',
      uk_region_locations: 'Possible UK locations',
      uk_company: 'UK recipient company',
    },
  },
  interactionsLabels: {
    view: {
      company: 'Company',
      subject: 'Subject',
      notes: 'Interaction notes',
      contact: 'Company contact',
      date: 'Date of interaction',
      dit_adviser: 'DIT adviser',
      interaction_type: 'Interaction type',
    },
    edit: {
      interaction_type: 'Interaction Type',
      subject: 'Subject',
      notes: 'Interaction notes',
      contact: 'Interaction contact',
      date: 'Date of interaction',
      dit_adviser: 'DIT adviser',
    },
  },
}

labels.valueLabels.edit = Object.assign({}, labels.valueLabels.view, labels.valueLabels.edit)

module.exports = labels
