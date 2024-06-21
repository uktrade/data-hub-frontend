export const LAND_DATE_OPTIONS = [
  { name: 'Show all', id: 'all-land-dates' },
  { name: 'Current year', id: '1' },
  { name: 'Previous Year', id: '2' },
  { name: 'Next Year', id: '3' },
]
export const PROJECT_STATUS_OPTIONS = [
  { name: 'Show all', id: 'all-statuses' },
  { name: 'Ongoing', id: 'ongoing' },
  { name: 'Delayed', id: 'delayed' },
  { name: 'Abandoned', id: 'abandoned' },
  { name: 'Lost', id: 'lost' },
  { name: 'Dormant', id: 'dormant' },
]

export const STAGE_OPTIONS = [
  {
    name: 'Show all',
    id: 'all-stages',
  },
  {
    name: 'Prospect',
    id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
  },
  {
    name: 'Assign PM',
    id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
  },
  {
    name: 'Active',
    id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
  },
  {
    name: 'Verify win',
    id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
  },
  {
    name: 'Won',
    id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
  },
]

export const SORT_OPTIONS = [
  {
    name: 'Recently created',
    id: 'created_on:desc',
  },
  {
    name: 'Recently updated',
    id: 'modified_on:desc',
  },
  {
    name: 'Earliest land date',
    id: 'estimated_land_date:asc',
  },
  {
    name: 'Latest land date',
    id: 'estimated_land_date:desc',
  },
  {
    name: 'Project name (A-Z)',
    id: 'name:asc',
  },
  {
    name: 'Project name (Z-A)',
    id: 'name:desc',
  },
]

export const INCOMPLETE_FIELDS = {
  client_cannot_provide_total_investment:
    'Can client provide total investment value?',
  number_new_jobs: 'Number of new jobs',
  strategic_drivers: 'Strategic drivers behind this investment',
  client_requirements: 'Client requirements',
  client_considering_other_countries:
    'Is the client considering other countries?',
  total_investment: 'Total investment',
  uk_region_locations: 'Possible UK locations for this investment',
  project_manager: 'Project Manager',
  project_assurance_adviser: 'Project Assurance Adviser',
  government_assistance:
    'Is this project receiving government financial assistance?',
  number_safeguarded_jobs: 'Number of safeguarded jobs',
  r_and_d_budget:
    'Does this project have budget for a research and development?',
  non_fdi_r_and_d_budget:
    'Is this project associated with a non-FDI R&D project?',
  new_tech_to_uk:
    'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
  export_revenue:
    'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
  address_1: 'Street',
  address_town: 'Town',
  address_postcode: 'Postcode',
  actual_uk_regions: 'UK regions landed',
  actual_land_date: 'Actual land date',
  average_salary: 'Average salary of new jobs',
  client_cannot_provide_foreign_investment:
    'Can client provide capital expenditure value?',
  delivery_partners: 'Delivery partners',
  competitor_countries: 'Competitor countries',
  foreign_equity_investment: 'Foreign equity investment',
  associated_non_fdi_r_and_d_project: 'Non-FDI R&D project',
  fdi_type: 'FDI type',
  specific_programmes: 'Specific investment programmes',
  uk_company: 'UK recipient company',
  investor_type: 'Investor type',
  level_of_involvement: 'Level of investor involvement',
}

export const STAGE_TAG_COLOURS = {
  Prospect: 'purple',
  'Assign PM': 'red',
  Active: 'blue',
  'Verify win': 'yellow',
  Won: 'green',
}
