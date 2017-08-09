// const faker = require('faker')

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    // Project details:
    addRequirmentsButton: {
      selector: "//a[@href='edit-requirements']",
      locateStrategy: 'xpath',
    },
    editRequirmentsButton: {
      selector: "//a[@class='button-secondary'][@href='edit-requirements']",
      locateStrategy: 'xpath',
    },
    addValueButton: {
      selector: "//a[@href='edit-value']",
      locateStrategy: 'xpath',
    },
    editValueButton: {
      selector: "//a[@class='button-secondary'][@href='edit-value']",
      locateStrategy: 'xpath',
    },
    editPMButton: {
      selector: "//a[@class='button button-secondary'][@href='edit-project-management']",
      locateStrategy: 'xpath',
    },
    editSummaryButton: {
      selector: "//a[@href='edit-details']",
      locateStrategy: 'xpath',
    },
    archiveButton: {
      selector: "//a[@aria-hidden='false']",
      locatorStrategy: 'xpath',
    },
    // Fill Requirements page:
    strategicDriver: '#strategic_drivers',
    strategicDriverList: '#strategic_drivers option:nth-child(2)',
    clientRequirements: '#client_requirements',
    consideringOtherCountriesYes: '#input--client_considering_other_countries--1',
    consideringOtherCountriesNo: '#input--client_considering_other_countries--2',
    possibleUkLocation: '#uk_region_locations',
    possibleUkLocationList: '#uk_region_locations option:nth-child(2)',
    ukLocationDeciededYes: 'label[for=input--site_decided--1]',
    ukLocationDeciededNo: 'label[for=input--site_decided--2]',
    saveButton: '.button button--save',
    cancelButton: '.button-link button--cancel js-button-cancel',
    // Fill Value page:
    totalInvestment: '#total_investment',
    totalInvestmentNo: 'a',
    foreignEquityInvestment: '#foreign_equity_investment',
    foreignEquityInvestmentNo: 'a',
    financialAssistanceYes: 'label[for=input--government_assistance--1]',
    financialAssistanceNo: 'label[for=input--government_assistance--2]',
    newJobs: '#number_new_jobs',
    averageSalary: '#average_salary',
    averageSalaryList: '#average_salary option:nth-child(2)',
    safeguardedJobs: '#number_safeguarded_jobs',
    budgetForRnDYes: 'label[for=input--r_and_d_budget--1]',
    budgetForRnDNo: 'label[for=input--r_and_d_budget--2]',
    nonFDIRnDYes: 'label[for=input--non_fdi_r_and_d_budget--1]',
    nonFDIRnDNo: 'label[for=input--non_fdi_r_and_d_budget--2]',
    newTechToUKYes: 'label[for=input--new_tech_to_uk--1]',
    newTechToUKNo: 'label[for=input--new_tech_to_uk--2]',
    exportRevenueYes: 'label[for=input--export_revenue--1]',
    exportRevenueNo: 'label[for=input--export_revenue--2]',

    // Fill Assign PM details:
    assignPMButton: 'a[href="edit-project-management"]',
    projectAssuranceAdviser: '#field-project_assurance_adviser',
    projectAssuranceAdviserList: '#field-project_assurance_adviser option:nth-child(2)',
    projectManager: '#field-project_manager',
    projectManagerList: '#field-project_manager option:nth-child(3)',

    // Requirement Details:
    strategicDriverFromProjectDetails: 'a',
    clientRequirementsFromProjectDetails: 'a',
    competitorCountryFromProjectDetails: 'a',
    possibleUkLocationFromProjectDetails: 'a',
    // Value Details:
    totalInvestmentFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[1]/td",
      locateStrategy: 'xpath',
    },
    foreignEquityInvestmentFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[2]/td",
      locateStrategy: 'xpath',
    },
    financialAssistanceFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[3]/td",
      locateStrategy: 'xpath',
    },
    newJobsFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[4]/td",
      locateStrategy: 'xpath',
    },
    averageSalaryFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[5]/td",
      locateStrategy: 'xpath',
    },
    safeguardedJobsFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[6]/td",
      locateStrategy: 'xpath',
    },
    budgetForRnDFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[7]/td",
      locateStrategy: 'xpath',
    },
    nonFDIRnDFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[8]/td",
      locateStrategy: 'xpath',
    },
    newTechToUKFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[9]/td",
      locateStrategy: 'xpath',
    },
    exportRevenueFromProjectDetails: {
      selector: ".//*[@id='main-content']/div/article/table[2]/tbody/tr[10]/td",
      locateStrategy: 'xpath',
    },

    // Assign PM details:
    projectAssuranceAdviserFromProjectTeamTab: {
      selector: ".//*[@id='xhr-outlet']/div/article/table[3]/tbody/tr[1]/td[2]",
      locateStrategy: 'xpath',
    },
    projectManagerFromProjectTeamTab: {
      selector: ".//*[@id='xhr-outlet']/div/article/table[2]/tbody/tr[2]/td[2]",
      locateStrategy: 'xpath',
    },

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
