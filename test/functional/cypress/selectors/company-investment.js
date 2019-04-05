module.exports = {
  tabs: {
    investmentProjects: '[data-auto-id=investmentProjectsTab]',
    largeCapitalProfile: '[data-auto-id=largeCapitalProfileTab]',
    growthCapitalProfile: '[data-auto-id=growthCapitalProfileTab]',
  },
  subHeading: '[data-auto-id=investmentSubheading]',
  createAProfile: '[data-auto-id=createAProfile]',
  investorDetails: {
    incompleteFields: '[data-auto-id=investorDetails] .incomplete-fields',
    summary: '[data-auto-id=investorDetails] summary',
    edit: '[data-auto-id=investorDetailsEdit]',
    save: '[data-auto-id=investorDetailsSave]',
    taskList: {
      investorType: {
        name: '[data-auto-id=investorType] .task-list__item-name',
        incomplete: '[data-auto-id=investorType] .task-list__item-incomplete',
      },
      globalAssetsUnderManagement: {
        name: '[data-auto-id=globalAssetsUnderManagement] .task-list__item-name',
        incomplete: '[data-auto-id=globalAssetsUnderManagement] .task-list__item-incomplete',
      },
      investableCapital: {
        name: '[data-auto-id=investableCapital] .task-list__item-name',
        incomplete: '[data-auto-id=investableCapital] .task-list__item-incomplete',
      },
      investorDescription: {
        name: '[data-auto-id=investorDescription] .task-list__item-name',
        incomplete: '[data-auto-id=investorDescription] .task-list__item-incomplete',
      },
      investorChecks: {
        name: '[data-auto-id=investorChecks] .task-list__item-name',
        incomplete: '[data-auto-id=investorChecks] .task-list__item-incomplete',
      },
    },
  },
  investorRequirements: {
    incompleteFields: '[data-auto-id=investorRequirements] .incomplete-fields',
    summary: '[data-auto-id=investorRequirements] summary',
    edit: '[data-auto-id=investorRequirementsEdit]',
    save: '[data-auto-id=investorRequirementsSave]',
    taskList: {
      dealTicketSize: {
        name: '[data-auto-id=dealTicketSize] .task-list__item-name',
        incomplete: '[data-auto-id=dealTicketSize] .task-list__item-incomplete',
      },
      assetClassesOfInterest: {
        name: '[data-auto-id=assetClassesOfInterest] .task-list__item-name',
        incomplete: '[data-auto-id=assetClassesOfInterest] .task-list__item-incomplete',
      },
      typesOfInvestment: {
        name: '[data-auto-id=typesOfInvestment] .task-list__item-name',
        incomplete: '[data-auto-id=typesOfInvestment] .task-list__item-incomplete',
      },
      minimumReturnRate: {
        name: '[data-auto-id=minimumReturnRate] .task-list__item-name',
        incomplete: '[data-auto-id=minimumReturnRate] .task-list__item-incomplete',
      },
      timeHorizonTenor: {
        name: '[data-auto-id=timeHorizonTenor] .task-list__item-name',
        incomplete: '[data-auto-id=timeHorizonTenor] .task-list__item-incomplete',
      },
      restrictionsConditions: {
        name: '[data-auto-id=restrictionsConditions] .task-list__item-name',
        incomplete: '[data-auto-id=restrictionsConditions] .task-list__item-incomplete',
      },
      constructionRisk: {
        name: '[data-auto-id=constructionRisk] .task-list__item-name',
        incomplete: '[data-auto-id=constructionRisk] .task-list__item-incomplete',
      },
      minimumEquityPercentage: {
        name: '[data-auto-id=minimumEquityPercentage] .task-list__item-name',
        incomplete: '[data-auto-id=minimumEquityPercentage] .task-list__item-incomplete',
      },
      desiredDealRole: {
        name: '[data-auto-id=desiredDealRole] .task-list__item-name',
        incomplete: '[data-auto-id=desiredDealRole] .task-list__item-incomplete',
      },
    },
  },
  location: {
    incompleteFields: '[data-auto-id=location] .incomplete-fields',
    summary: '[data-auto-id=location] summary',
    edit: '[data-auto-id=edit-location]',
    save: '[data-auto-id=save-location]',
    taskList: {
      ukLocationsOfInterest: {
        name: '[data-auto-id=ukLocationsOfInterest] .task-list__item-name',
        incomplete: '[data-auto-id=ukLocationsOfInterest] .task-list__item-incomplete',
      },
      otherCountriesTheInvestorIsConsidering: {
        name: '[data-auto-id=otherCountriesTheInvestorIsConsidering] .task-list__item-name',
        incomplete: '[data-auto-id=otherCountriesTheInvestorIsConsidering] .task-list__item-incomplete',
      },
      notesOnInvestorsLocationPreferences: {
        name: '[data-auto-id=notesOnInvestorsLocationPreferences] .task-list__item-name',
        incomplete: '[data-auto-id=notesOnInvestorsLocationPreferences] .task-list__item-incomplete',
      },
    },
  },
}
