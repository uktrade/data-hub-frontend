export const INVESTMENT_PROJECT_FORM_VALIDATION = {
  PROJECT_NAME: 'Enter a project name',
  PROJECT_DESCRIPTION: 'Enter a project description',
  PRIMARY_SECTOR: 'Choose a primary sector',
  BUSINESS_ACTIVITY: 'Choose a business activity',
  CLIENT_CONTACT: 'Choose a client contact',
  IS_RELATIONSHIP_MANAGER:
    "Select yes if you're the client relationship manager for this project",
  IS_REFERRAL_SOURCE:
    "Select yes if you're the referral source for this project",
  ESTIMATED_LANDDATE: 'Enter an estimated land date',
  REFERRAL_SOURCE_ACTIVITY: 'Choose a referral source activity',
}

export const FIELDS = {
  // Update investment project summary
  NAME: {
    name: 'name',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.PROJECT_NAME,
  },
  DESCRIPTION: {
    name: 'description',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.PROJECT_DESCRIPTION,
  },
  SECTOR: {
    name: 'sector',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.PRIMARY_SECTOR,
  },
  BUSINESS_ACTIVITIES: {
    name: 'business_activities',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.BUSINESS_ACTIVITY,
  },
  CLIENT_CONTACTS: {
    name: 'client_contacts',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.CLIENT_CONTACT,
  },
  IS_REFERRAL_SOURCE: {
    name: 'is_referral_source',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.IS_REFERRAL_SOURCE,
  },
  ESTIMATED_LAND_DATE: {
    name: 'estimated_land_date',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.ESTIMATED_LANDDATE,
  },
  REFERRAL_SOURCE_ACTIVITY: {
    name: 'referral_source_activity',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.REFERRAL_SOURCE_ACTIVITY,
  },
  INVESTOR_TYPE: {
    name: 'investor_type',
    message: 'Select an investor type',
  },
  LEVEL_OF_INVOLVEMENT: {
    name: 'level_of_involvement',
    message: 'Select a level of involvement',
  },
  SPECIFIC_PROGRAMMES: {
    name: 'specific_programmes',
    message: 'Select a specific programme',
  },
  LIKELIHOOD_TO_LAND: {
    name: 'likelihood_to_land',
    message: 'Select a likelihood of landing value',
  },
  ACTUAL_LAND_DATE: {
    name: 'actual_land_date',
    message: 'Enter an actual land date',
  },

  // Edit requirements and location
  STRATEGIC_DRIVERS: {
    name: 'strategic_drivers',
    message: 'Select a strategic driver',
  },
  CLIENT_REQUIREMENTS: {
    name: 'client_requirements',
    message: 'Enter client requirements',
  },
  CLIENT_CONSIDERING_OTHER_COUNTRIES: {
    name: 'client_considering_other_countries',
    message: 'Select other countries considered',
  },
  SITE_DECIDED: { name: 'site_decided', message: 'Select a UK region' },
  DELIVERY_PARTNERS: {
    name: 'delivery_partners',
    message: 'Select a delivery partner',
  },
  UK_REGION_LOCATIONS: {
    name: 'uk_region_locations',
    message: 'Select a possible UK location',
  },

  ADDRESS1: { name: 'address1', message: 'Enter an address' },
  CITY: { name: 'city', message: 'Enter a town or city' },
  POSTCODE: { name: 'postcode', message: 'Enter a postcode' },

  // Edit value
  CLIENT_CANNOT_PROVIDE_FOREIGN_INVESTMENT: {
    name: 'client_cannot_provide_foreign_investment',
    message: 'Select whether client can provide capital expenditure value',
  },
  CLIENT_CANNOT_PROVIDE_TOTAL_INVESTMENT: {
    name: 'client_cannot_provide_total_investment',
    message: 'Select whether client can provide total investment value',
  },
  EXPORT_REVENUE: {
    name: 'export_revenue',
    message: 'Select export revenue as a result of the FDI project',
  },
  GOVERNMENT_ASSISTANCE: {
    name: 'government_assistance',
    message: 'Select whether project receives government financial assitance',
  },
  NEW_TECH_TO_UK: {
    name: 'new_tech_to_uk',
    message: 'Select whether project brings new technology to the UK',
  },
  NON_FDI_R_AND_D_BUDGET: {
    name: 'non_fdi_r_and_d_budget',
    message:
      'Select whether the project is associated with a non-FDI R&D project',
  },
  NUMBER_NEW_JOBS: {
    name: 'number_new_jobs',
    message: 'Value for number of new jobs is required',
  },
  AVERAGE_SALARY: {
    name: 'average_salary',
    message: 'Value for average salary of new jobs is required',
  },
  NUMBER_SAFEGUARDED_JOBS: {
    name: 'number_safeguarded_jobs',
    message: 'Value for number of safeguarded jobs is required',
  },
  R_AND_D_BUDGET: {
    name: 'r_and_d_budget',
    message: 'Select whether project has budget for research and development',
  },
  TOTAL_INVESTMENT: {
    name: 'total_investment',
    message: '-total_investment',
  },
}

export const UPDATE_SUMMARY_BASE_FIELDS = [
  // Sector and investment_type can't be null, but should always be set in all stages.
  // Cypress doesn't pick up null value for the above.
  FIELDS.NAME,
  FIELDS.DESCRIPTION,
  FIELDS.BUSINESS_ACTIVITIES,
  FIELDS.CLIENT_CONTACTS,
  FIELDS.IS_REFERRAL_SOURCE,
  FIELDS.ESTIMATED_LAND_DATE,
  FIELDS.REFERRAL_SOURCE_ACTIVITY,
]

export const UPDATE_SUMMARY_ADDITIONAL_FIELDS = [
  FIELDS.INVESTOR_TYPE,
  FIELDS.LEVEL_OF_INVOLVEMENT,
  FIELDS.SPECIFIC_PROGRAMMES,
  FIELDS.LIKELIHOOD_TO_LAND,
  FIELDS.ACTUAL_LAND_DATE,
]

export const EDIT_REQUIREMENTS_BASE_FIELDS = [
  FIELDS.STRATEGIC_DRIVERS,
  FIELDS.CLIENT_REQUIREMENTS,
  FIELDS.CLIENT_CONSIDERING_OTHER_COUNTRIES,
  FIELDS.UK_REGION_LOCATIONS,
]

export const EDIT_REQUIREMENTS_ADDITIONAL_FIELDS = [
  ...EDIT_REQUIREMENTS_BASE_FIELDS,
  FIELDS.DELIVERY_PARTNERS,
  { name: 'site_decided', message: 'A UK region is required' },
]

export const EDIT_VALUE_ADDITIONAL_FIELDS = [
  FIELDS.CLIENT_CANNOT_PROVIDE_TOTAL_INVESTMENT,
  FIELDS.CLIENT_CANNOT_PROVIDE_FOREIGN_INVESTMENT,
  FIELDS.EXPORT_REVENUE,
  FIELDS.GOVERNMENT_ASSISTANCE,
  FIELDS.NEW_TECH_TO_UK,
  FIELDS.NON_FDI_R_AND_D_BUDGET,
  FIELDS.NUMBER_NEW_JOBS,
  FIELDS.AVERAGE_SALARY,
  FIELDS.NUMBER_SAFEGUARDED_JOBS,
  FIELDS.R_AND_D_BUDGET,
]
