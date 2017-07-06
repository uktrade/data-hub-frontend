const faker = require('faker')

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    investmentsTab: {
      selector: "//nav/a[contains(@href, 'investments')]",
      locateStrategy: 'xpath',
    },
    addInvestmentProjectButton: '#main-content div article div a',
    equitySourceYes: '#client-equity-source-options label:nth-child(2)',
    equitySourceNo: '#client-equity-source-options label:nth-child(3)',
    clientContact: '#client_contacts-wrapper input',
    clientContactList: '#client_contacts-wrapper ul li:nth-child(1)',
    clientRelationshipManagerYes: {
      selector: "//label[@for='input--is-relationship-manager--1']",
      locateStrategy: 'xpath',
    },
    clientRelationshipManagerNo: {
      selector: "//label[@for='input--is-relationship-manager--2']",
      locateStrategy: 'xpath',
    },
    clientRelationshipManager: '#client_relationship_manager-wrapper input',
    clientRelationshipManagerList: '#client_relationship_manager-wrapper ul li:nth-child(4)',
    referralSourceAdviser: '#referral_source_adviser-wrapper input',
    referralSourceAdviserList: '#referral_source_adviser-wrapper ul li:nth-child(4)',
    referralSourceYes: {
      selector: "//label[@for='input--is-referral-source--1']",
      locateStrategy: 'xpath',
    },
    referralSourceNo: {
      selector: "//label[@for='input--is-referral-source--2']",
      locateStrategy: 'xpath',
    },
    referralSourceActivity: '#referral_source_activity',
    referralSourceActivityList: '#referral_source_activity option:nth-child(2)',
    typeOfInvestmentCommitmentToInvest: {
      selector: "//label[@for='input--investment_type--1']",
      locateStrategy: 'xpath',
    },
    typeOfInvestmentFDI: {
      selector: "//label[@for='input--investment_type--2']",
      locateStrategy: 'xpath',
    },
    typeOfInvestmentNonFDI: {
      selector: "//label[@for='input--investment_type--3']",
      locateStrategy: 'xpath',
    },
    typeOfFDI: '#fdi_type-wrapper',
    typeOfFDIList: '#fdi_type-wrapper option:nth-child(2)',
    typeOfNonFDI: '#non_fdi_type-wrapper',
    typeOfNonFDIList: '#non_fdi_type-wrapper option:nth-child(2)',
    primarySector: '#sector-wrapper',
    primarySectorList: '#sector-wrapper option:nth-child(2)',
    businessActivity: '#business_activities-wrapper',
    businessActivityList: '#business_activities-wrapper option:nth-child(2)',
    projectName: '#name',
    description: '#description',
    projectBeSharedYes: {
      selector: "//label[@for='input--project_shareable--1']",
      locateStrategy: 'xpath',
    },
    projectBeSharedNo: {
      selector: "//label[@for='input--project_shareable--2']",
      locateStrategy: 'xpath',
    },
    signedaNDAYes: {
      selector: "//label[@for='input--nda_signed--1']",
      locateStrategy: 'xpath',
    },
    signedaNDANo: {
      selector: "//label[@for='input--nda_signed--2']",
      locateStrategy: 'xpath',
    },
    landMonth: '#land-date_month',
    landYear: '#land-date_year',
    projectNameFromCompanyProfile: '.results-list li:last-child a',
    projectNameFromSummaryPage: {
      selector: ".//*[@id='main-content']/h2",
      locateStrategy: 'xpath',
    },
    projectSummaryTitle: {
      selector: ".//*[@id='main-content']/div[2]/article/h2[1]",
      locateStrategy: 'xpath',
    },
    projectTeamTab: {
      selector: "//a[contains(@href, '/team')]",
      locateStrategy: 'xpath',
    },
    clientRelationsshipManagementAdviserName: {
      selector: '//article/table[1]/tbody/tr/td[1]',
      locateStrategy: 'xpath',
    },
    referralSourceAdviserName: {
      selector: '//article/table[2]/tbody/tr/td[1]',
      locateStrategy: 'xpath',
    },
    typeOfInvestmentFromProjectDetails: {
      selector: '//article/table[1]/tbody/tr[2]/td',
      locateStrategy: 'xpath',
    },
    sourceCompanySearch: '#search-q',
    firstCompanyFromList: {
      selector: ".//*[@id='main-content']/div/article/ol/li[1]//h3",
      locateStrategy: 'xpath',
    },
  },

  commands: [
    {
      clickInvestmentsTab () {
        return this
          .click('@investmentsTab')
      },
      clickAddInvestmentProjectButton () {
        return this
          .click('@addInvestmentProjectButton')
      },
      clickEquitySourceYes () {
        return this
          .click('@equitySourceYes')
      },
      clickEquitySourceNo () {
        return this
          .click('@equitySourceNo')
      },
      selectClientContact () {
        return this
          .setValue('@clientContact', 'c')
          .click('@clientContactList')
      },
      clickClientRelationshipManagerYes () {
        return this
          .click('@clientRelationshipManagerYes')
      },
      clickClientRelationshipManagerNo () {
        return this
          .click('@clientRelationshipManagerNo')
      },
      clickReferralSourceYes () {
        return this
          .click('@referralSourceYes')
      },
      clickReferralSourceNo () {
        return this
          .click('@referralSourceNo')
      },
      selectReferralSourceActivity () {
        return this
          .click('@referralSourceActivity')
          .click('@referralSourceActivityList')
      },
      clickTypeOfInvestmentCommitmentToInvest () {
        return this
          .click('@typeOfInvestmentCommitmentToInvest')
      },
      clickTypeOfInvestmentFDI () {
        return this
          .click('@typeOfInvestmentFDI')
      },
      clickTypeOfInvestmentNonFDI () {
        return this
          .click('@typeOfInvestmentNonFDI')
      },
      selectTypeOfFDI () {
        return this
          .click('@typeOfFDI')
          .click('@typeOfFDIList')
      },
      selectTypeOfNonFDI () {
        return this
          .click('@typeOfNonFDI')
          .click('@typeOfNonFDIList')
      },
      selectPrimarySector () {
        return this
          .click('@primarySector')
          .click('@primarySectorList')
      },
      selectBusinessActivity () {
        return this
          .click('@businessActivity')
          .click('@businessActivityList')
      },
      enterProjectName (projectName) {
        return this
          .setValue('@projectName', projectName)
      },
      enterDescription () {
        return this
          .setValue('@description', faker.lorem.paragraph())
      },
      clickProjectBeSharedYes () {
        return this
          .click('@projectBeSharedYes')
      },
      clickProjectBeSharedNo () {
        return this
          .click('@projectBeSharedNo')
      },
      clickSignedaNDAYes () {
        return this
          .click('@signedaNDAYes')
      },
      clicksignedaNDANo () {
        return this
          .click('@signedaNDANo')
      },
      enterLandMonth () {
        return this
          .setValue('@landMonth', faker.random.number({ min: 1, max: 12 }))
      },
      enterLandYear () {
        return this
          .setValue('@landYear', faker.random.number({ min: 2018, max: 2020 }))
      },
      clickOnProjectNameFromCompanyProfile () {
        return this
          .click('@projectNameFromCompanyProfile')
      },
      clickOnProjectTeamTab () {
        return this
          .click('@projectTeamTab')
      },
      enterSourceCompanySearch (companyName) {
        return this
          .setValue('@sourceCompanySearch', companyName)
      },
      clickOnCompanyFromList () {
        return this
          .click('@firstCompanyFromList')
      },
      submitTheForm () {
        return this
        .submitForm('form')
      },

      createNewInvestmentProject (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .clickTypeOfInvestmentCommitmentToInvest()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .clickProjectBeSharedYes()
          .clicksignedaNDANo()
          .enterLandMonth()
          .enterLandYear()
          .submitTheForm()
      },

      createNewInvestmentProjectWithDifferentClientRelationManager (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerNo()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .clickTypeOfInvestmentCommitmentToInvest()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .clickProjectBeSharedYes()
          .clicksignedaNDANo()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectWithDifferentReferralSourceAdviser (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceNo()
          .selectReferralSourceActivity()
          .clickTypeOfInvestmentCommitmentToInvest()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .clickProjectBeSharedYes()
          .clicksignedaNDANo()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectWithDifferentClientAndReferralDetails (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerNo()
          .clickReferralSourceNo()
          .selectReferralSourceActivity()
          .clickTypeOfInvestmentCommitmentToInvest()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .clickProjectBeSharedYes()
          .clicksignedaNDANo()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectWithFDIasInvestmentType (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .clickTypeOfInvestmentFDI()
          .selectTypeOfFDI()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .clickProjectBeSharedYes()
          .clicksignedaNDANo()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectWithNonFDIasInvestmentType (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .clickTypeOfInvestmentNonFDI()
          .selectTypeOfNonFDI()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .clickProjectBeSharedYes()
          .clicksignedaNDANo()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectAsNonForeignEquityInvestment (projectName) {
        return this
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .clickTypeOfInvestmentCommitmentToInvest()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .clickProjectBeSharedYes()
          .clicksignedaNDANo()
          .enterLandMonth()
          .enterLandYear()
          .submitTheForm()
      },
    },
  ],
}
