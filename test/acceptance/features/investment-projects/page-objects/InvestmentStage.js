// const faker = require('faker')

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    // Project details:
    addRequirmentsButton: 'a[href="edit-requirements"]',
    editRequirmentsButton: 'a[class="button--secondary"][href="edit-requirements"]',
    addValueButton: 'a[href="edit-value"]',
    editValueButton: 'a[class="button--secondary"][href="edit-value"]',
    editPMButton: 'a[class="button button--secondary"][href="edit-project-management"]',
    editSummaryButton: 'a[href="edit-details"]',
    archiveButton: 'a[aria-hidden="false"]',

    // Fill Requirements page:
    strategicDriver: '#strategic_drivers',
    strategicDriverList: '#strategic_drivers option:nth-child(2)',
    clientRequirements: '#client_requirements',
    consideringOtherCountriesYes: 'label[for=input--client_considering_other_countries--1]',
    consideringOtherCountriesNo: 'label[for=input--client_considering_other_countries--2]',
    competitorCountries: '#competitor_countries',
    competitorCountriesList: '#competitor_countries option:nth-child(9)',
    possibleUkLocation: '#uk_region_locations',
    possibleUkLocationList: '#uk_region_locations option:nth-child(2)',
    ukLocationDeciededYes: 'label[for=input--site_decided--1]',
    ukLocationDeciededNo: 'label[for=input--site_decided--2]',
    saveButton: '.button button--save',
    cancelButton: '.button-link button--cancel js-button-cancel',

    // Fill Value page:
    totalInvestment: '#field-total_investment',
    totalInvestmentYes: 'label[for=field-client_cannot_provide_total_investment-1]',
    totalInvestmentNo: 'label[for=field-client_cannot_provide_total_investment-2]',
    foreignEquityInvestment: '#field-foreign_equity_investment',
    foreignEquityInvestmentYes: 'label[for=field-client_cannot_provide_foreign_investment-1]',
    foreignEquityInvestmentNo: 'label[for=field-client_cannot_provide_foreign_investment-2]',
    financialAssistanceYes: 'label[for=field-government_assistance-1]',
    financialAssistanceNo: 'label[for=field-government_assistance-2]',
    newJobs: '#field-number_new_jobs',
    averageSalaryBelow25K: 'label[for=field-average_salary-1]',
    averageSalary25_29K: 'label[for=field-average_salary-2]',
    averageSalary30_34K: 'label[for=field-average_salary-3]',
    averageSalaryAbove35K: 'label[for=field-average_salary-4]',
    safeguardedJobs: '#field-number_safeguarded_jobs',
    budgetForRnDYes: 'label[for=field-r_and_d_budget-1]',
    budgetForRnDNo: 'label[for=field-r_and_d_budget-2]',
    nonFDIRnDYes: 'label[for=field-non_fdi_r_and_d_budget-1]',
    nonFDIRnDNo: 'label[for=field-non_fdi_r_and_d_budget-2]',
    newTechToUKYes: 'label[for=field-new_tech_to_uk-1]',
    newTechToUKNo: 'label[for=field-new_tech_to_uk-2]',
    exportRevenueYes: 'label[for=field-export_revenue-1]',
    exportRevenueNo: 'label[for=field-export_revenue-2]',

    // Fill Assign PM details:
    assignPMButton: 'a[href="edit-project-management"]',
    projectAssuranceAdviser: '#field-project_assurance_adviser',
    projectAssuranceAdviserList: '#field-project_assurance_adviser option:nth-child(2)',
    projectManager: '#field-project_manager',
    projectManagerList: '#field-project_manager option:nth-child(3)',

    // Requirement Details:
    strategicDriverFromProjectDetails: '.table--key-value:nth-child(6) tr:nth-child(1) td',
    clientRequirementsFromProjectDetails: '.table--key-value:nth-child(6) tr:nth-child(2) td',
    competitorCountryFromProjectDetails: '.table--key-value:nth-child(6) tr:nth-child(3) td',
    possibleUkLocationFromProjectDetails: '.table--key-value:nth-child(6) tr:nth-child(4) td',

    // Value Details:
    totalInvestmentFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(1) td',
    foreignEquityInvestmentFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(2) td',
    financialAssistanceFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(3) td',
    newJobsFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(4) td',
    averageSalaryFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(5) td',
    safeguardedJobsFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(6) td',
    budgetForRnDFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(7) td',
    nonFDIRnDFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(8) td',
    newTechToUKFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(9) td',
    exportRevenueFromProjectDetails: '.table--key-value:nth-child(9) tr:nth-child(10) td',

    // Assign PM details:
    projectAssuranceAdviserFromProjectTeamTab: '.data-table:nth-child(5) tbody tr:nth-child(1) td:nth-child(2)',
    projectManagerFromProjectTeamTab: '.data-table:nth-child(5) tbody tr:nth-child(2) td:nth-child(2)',

    assignPMstage: 'a',
    projectStateFromTop: 'a',
    changeStateButton: 'a',
    changeState: 'a',
    changeStateList: 'a',
    projectTeamTab: 'a[href*="/team"]',
  },

  commands: [
    {
      clickOnAddRequirmentsButton () {
        return this
          .click('@addRequirmentsButton')
      },

      enterAllRequirementsSection () {
        return this
          .click('@strategicDriverList')
          .click('@consideringOtherCountriesNo')
          .click('@possibleUkLocationList')
          .click('@ukLocationDeciededYes')
      },
    },
  ],
}
