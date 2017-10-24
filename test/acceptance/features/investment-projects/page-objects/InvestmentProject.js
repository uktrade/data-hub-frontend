const faker = require('faker')

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    investmentsTab: 'a[href*="/investments"]',
    addInvestmentProjectButton: '#main-content div article div a',
    equitySourceYes: 'label[for="field-is_equity_source-1"]',
    equitySourceNo: 'label[for="field-is_equity_source-2"]',
    clientContact: '#field-client_contacts',
    clientContactList: '#field-client_contacts option:nth-child(2)',
    clientRelationshipManagerYes: 'label[for="field-is_relationship_manager-1"]',
    clientRelationshipManagerNo: 'label[for="field-is_relationship_manager-2"]',
    clientRelationshipManager: '#field-client_relationship_manager',
    clientRelationshipManagerList: '#field-client_relationship_manager option:nth-child(2)',
    referralSourceAdviser: '#field-referral_source_adviser',
    referralSourceAdviserList: '#field-referral_source_adviser option:nth-child(2)',
    referralSourceYes: 'label[for="field-is_referral_source-1"]',
    referralSourceNo: 'label[for="field-is_referral_source-2"]',
    referralSourceActivity: '#field-referral_source_activity',
    referralSourceActivityList: '#field-referral_source_activity option:nth-child(2)',
    typeOfInvestmentCommitmentToInvest: 'label[for="field-investment_type-3"] span:first-child',
    typeOfInvestmentFDI: 'label[for="field-investment_type-1"] span:first-child',
    typeOfInvestmentNonFDI: 'label[for="field-investment_type-2"] span:first-child',
    typeOfFDI: '#field-fdi_type',
    typeOfFDIListAcquisition: '#field-fdi_type option:nth-child(2)',
    typeOfFDIListCapitalOnly: '#field-fdi_type option:nth-child(3)',
    typeOfFDIListMerger: '#field-fdi_type option:nth-child(7)',
    typeOfFDIListRetention: '#field-fdi_type option:nth-child(8)',
    typeOfNonFDI: '#field-non_fdi_type',
    typeOfNonFDIList: '#field-non_fdi_type option:nth-child(2)',
    primarySector: '#field-sector',
    primarySectorList: '#field-sector option:nth-child(2)',
    businessActivity: '#field-business_activities',
    businessActivityList: '#field-business_activities option:nth-child(2)',
    projectName: '#field-name',
    description: '#field-description',
    landMonth: '#field-estimated_land_date_month',
    landYear: '#field-estimated_land_date_year',
    projectNameFromCompanyProfile: '.c-entity-list li:first-child a',
    projectNameFromSummaryPage: '.c-local-header__heading',
    projectTeamTab: 'a[href*="/team"]',
    clientRelationsshipManagementAdviserName: 'article table:nth-child(2) tbody tr:nth-child(1) td:nth-child(2)',
    referralSourceAdviserName: 'article table:nth-child(2) tbody tr:nth-child(2) td:nth-child(2)',
    typeOfInvestmentFromProjectDetails: 'article table:nth-child(3) tbody tr:nth-child(2) td:nth-child(2)',
    sourceCompanySearch: '#field-q',
    firstCompanyFromList: '.c-entity-list li:first-child h3 a',
    investmentprojecttab: 'a[href*="/search/investment-projects"]',
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
          // .setValue('@clientContact', 'c')
          .click('@clientContact')
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
          .click('@typeOfFDIListAcquisition')
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
      clickOnInvestmentProjectsTabUnderSearch () {
        return this
          .click('@investmentprojecttab')
      },

      createNewInvestmentProject (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickTypeOfInvestmentFDI()
          .selectTypeOfFDI()
          .submitTheForm()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .enterLandMonth()
          .enterLandYear()
          .submitTheForm()
      },

      createNewInvestmentProjectWithDifferentClientRelationManager (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickTypeOfInvestmentFDI()
          .selectTypeOfFDI()
          .submitTheForm()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerNo()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectWithDifferentReferralSourceAdviser (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickTypeOfInvestmentFDI()
          .selectTypeOfFDI()
          .submitTheForm()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceNo()
          .selectReferralSourceActivity()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectWithDifferentClientAndReferralDetails (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickTypeOfInvestmentFDI()
          .selectTypeOfFDI()
          .submitTheForm()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerNo()
          .clickReferralSourceNo()
          .selectReferralSourceActivity()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectWithFDIasInvestmentType (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickTypeOfInvestmentFDI()
          .selectTypeOfFDI()
          .submitTheForm()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
          .enterLandMonth()
          .enterLandYear()
      },

      createNewInvestmentProjectWithNonFDIasInvestmentType (projectName) {
        return this
          .clickAddInvestmentProjectButton()
          .clickTypeOfInvestmentNonFDI()
          .selectTypeOfNonFDI()
          .submitTheForm()
          .clickEquitySourceYes()
          .submitTheForm()
          .selectClientContact()
          .clickClientRelationshipManagerYes()
          .clickReferralSourceYes()
          .selectReferralSourceActivity()
          .selectPrimarySector()
          .selectBusinessActivity()
          .enterProjectName(projectName)
          .enterDescription()
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
          .enterLandMonth()
          .enterLandYear()
          .submitTheForm()
      },
    },
  ],
}
