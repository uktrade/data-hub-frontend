module.exports = {
  tabs: {
    investmentProjects: '[data-auto-id="bodyMainContent"] li:nth-child(1)',
    largeCapitalProfile: '[data-auto-id="bodyMainContent"] li:nth-child(2)',
    growthCapitalProfile: '[data-auto-id="bodyMainContent"] li:nth-child(3)',
  },
  subHeading: '[data-auto-id="bodyMainContent"] h2',
  createAProfile: '[data-auto-id="bodyMainContent"] button',
  investorDetails: {
    incompleteFields: '[data-auto-id=investorDetails] .incomplete-fields',
    summary: '[data-auto-id=investorDetails] summary',
    edit: '[data-auto-id=investorDetailsEdit]',
    save: '[data-auto-id=investorDetailsSave]',
    investorType: '[data-auto-id=investorType]',
    globalAssetsUnderManagement: '[data-auto-id=globalAssetsUnderManagement]',
    investableCapital: '[data-auto-id=investableCapital]',
    investorDescription: '[data-auto-id=investorDescription]',
    requiredChecks: {
      cleared: '[data-auto-id=requiredChecks] #requiredChecks-1',
      clearedDay: '[data-auto-id=requiredChecksCleared] #cleared-day',
      clearedMonth: '[data-auto-id=requiredChecksCleared] #cleared-month',
      clearedYear: '[data-auto-id=requiredChecksCleared] #cleared-year',
      issuesIdentified: '[data-auto-id=requiredChecks] #requiredChecks-2',
      notYetChecked: '[data-auto-id=requiredChecks] #requiredChecks-3',
      notRequired: '[data-auto-id=requiredChecks] #requiredChecks-4',
      adviser: {
        placeHolder: '#conditional-requiredChecks-1 .multiselect__tags',
        textInput: '#conditional-requiredChecks-1 .multiselect__input',
        selectedOption: '#conditional-requiredChecks-1 .multiselect__single',
      },
    },
    taskList: {
      investorType: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(1) .task-list__item-name',
        complete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(1) .task-list__item-complete',
        incomplete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(1) .task-list__item-incomplete',
      },
      globalAssetsUnderManagement: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(2) .task-list__item-name',
        complete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(2) .task-list__item-complete',
        incomplete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(2) .task-list__item-incomplete',
      },
      investableCapital: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(3) .task-list__item-name',
        complete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(3) .task-list__item-complete',
        incomplete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(3) .task-list__item-incomplete',
      },
      investorDescription: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(4) .task-list__item-name',
        complete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(4) .task-list__item-complete',
        incomplete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(4) .task-list__item-incomplete',
      },
      requiredChecks: {
        name: '[data-auto-id="investorDetails"] ul > li:nth-child(5) .task-list__item-name',
        complete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(5) .task-list__item-complete',
        completeDate:
          '[data-auto-id="investorDetails"] ul > li:nth-child(5) span:nth-child(3)',
        adviser:
          '[data-auto-id="investorDetails"] ul > li:nth-child(5) span:nth-child(4)',
        incomplete:
          '[data-auto-id="investorDetails"] ul > li:nth-child(5) .task-list__item-incomplete',
      },
    },
  },
  investorRequirements: {
    incompleteFields: '[data-auto-id=investorRequirements] .incomplete-fields',
    summary: '[data-auto-id=investorRequirements] summary',
    edit: '[data-auto-id=investorRequirementsEdit]',
    save: '[data-auto-id=investorRequirementsSave]',
    dealTicketSize: {
      name: '[data-auto-id=dealTicketSizes] legend',
      upTo49Million: '[data-auto-id=dealTicketSizes] #dealTicketSizes-1',
      fiftyTo99Million: '[data-auto-id=dealTicketSizes] #dealTicketSizes-2',
      oneHundredTo249Million:
        '[data-auto-id=dealTicketSizes] #dealTicketSizes-3',
      twoHundredFiftyTo499Million:
        '[data-auto-id=dealTicketSizes] #dealTicketSizes-4',
      fiveHundredTo999Million:
        '[data-auto-id=dealTicketSizes] #dealTicketSizes-5',
      oneBillionPlus: '[data-auto-id=dealTicketSizes] #dealTicketSizes-6',
    },
    assetClasses: {
      name: '[data-auto-id=assetClasses] .label',
      energyAndInfrastructure: {
        name: '[data-auto-id=assetClasses] legend',
        biofuel: '[data-auto-id=assetClasses] #energyAndInfrastructure-1',
        biomass: '[data-auto-id=assetClasses] #energyAndInfrastructure-2',
        directHeating: '[data-auto-id=assetClasses] #energyAndInfrastructure-3',
        energyFromWaste:
          '[data-auto-id=assetClasses] #energyAndInfrastructure-4',
        energyStorage: '[data-auto-id=assetClasses] #energyAndInfrastructure-5',
        gasFiredPower: '[data-auto-id=assetClasses] #energyAndInfrastructure-6',
        nuclear: '[data-auto-id=assetClasses] #energyAndInfrastructure-7',
        regulatedAssets:
          '[data-auto-id=assetClasses] #energyAndInfrastructure-8',
        smartEnergy: '[data-auto-id=assetClasses] #energyAndInfrastructure-9',
        solarPower: '[data-auto-id=assetClasses] #energyAndInfrastructure-10',
        transport: '[data-auto-id=assetClasses] #energyAndInfrastructure-11',
        waveAndTidal: '[data-auto-id=assetClasses] #energyAndInfrastructure-12',
        windpowerOffshore:
          '[data-auto-id=assetClasses] #energyAndInfrastructure-13',
        windpowerOnshore:
          '[data-auto-id=assetClasses] #energyAndInfrastructure-14',
        upstreamOilAndGas:
          '[data-auto-id=assetClasses] #energyAndInfrastructure-15',
      },
      realEstate: {
        name: '[data-auto-id=assetClasses] legend',
        advancedManufactoring: '[data-auto-id=assetClasses] #realEstate-1',
        commercialLed: '[data-auto-id=assetClasses] #realEstate-2',
        dataCentre: '[data-auto-id=assetClasses] #realEstate-3',
        gardenCities: '[data-auto-id=assetClasses] #realEstate-4',
        hotel: '[data-auto-id=assetClasses] #realEstate-5',
        leisure: '[data-auto-id=assetClasses] #realEstate-6',
        lifeSciences: '[data-auto-id=assetClasses] #realEstate-7',
        logistics: '[data-auto-id=assetClasses] #realEstate-8',
        mixedUse: '[data-auto-id=assetClasses] #realEstate-9',
        privateRentedSector: '[data-auto-id=assetClasses] #realEstate-10',
        regeneration: '[data-auto-id=assetClasses] #realEstate-11',
        researchAndDevelopment: '[data-auto-id=assetClasses] #realEstate-12',
        residentialLed: '[data-auto-id=assetClasses] #realEstate-13',
        retail: '[data-auto-id=assetClasses] #realEstate-14',
        smartCities: '[data-auto-id=assetClasses] #realEstate-15',
        studentHousing: '[data-auto-id=assetClasses] #realEstate-16',
        transportHub: '[data-auto-id=assetClasses] #realEstate-17',
      },
    },
    investmentTypes: {
      name: '[data-auto-id=investmentTypes] legend',
      projectEquity: '[data-auto-id=investmentTypes] #investmentTypes-1',
      projectDebt: '[data-auto-id=investmentTypes] #investmentTypes-2',
      corporateEquity: '[data-auto-id=investmentTypes] #investmentTypes-3',
      corporateDebt: '[data-auto-id=investmentTypes] #investmentTypes-4',
      mezzanineDebt: '[data-auto-id=investmentTypes] #investmentTypes-5',
      ventureCapitalFunds: '[data-auto-id=investmentTypes] #investmentTypes-6',
      energyInfrastructure: '[data-auto-id=investmentTypes] #investmentTypes-7',
      privateEquity: '[data-auto-id=investmentTypes] #investmentTypes-8',
    },
    minimumReturnRate: {
      name: '[data-auto-id=minimumReturnRate] legend',
      zeroTo5Percent: '[data-auto-id=minimumReturnRate] #minimumReturnRate-1',
      fiveTo10Percent: '[data-auto-id=minimumReturnRate] #minimumReturnRate-2',
      tenTo15Percent: '[data-auto-id=minimumReturnRate] #minimumReturnRate-3',
      fifteenPercent: '[data-auto-id=minimumReturnRate] #minimumReturnRate-4',
    },
    timeHorizons: {
      name: '[data-auto-id=timeHorizons] legend',
      upToFiveYears: '[data-auto-id=timeHorizons] #timeHorizons-1',
      fiveTo9Years: '[data-auto-id=timeHorizons] #timeHorizons-2',
      tenTo14Years: '[data-auto-id=timeHorizons] #timeHorizons-3',
      fifteenYearsPlus: '[data-auto-id=timeHorizons] #timeHorizons-4',
    },
    restrictions: {
      name: '[data-auto-id=restrictions] legend',
      liquidity: '[data-auto-id=restrictions] #restrictions-1',
      inflationAdjustment: '[data-auto-id=restrictions] #restrictions-2',
      requireFXHedge: '[data-auto-id=restrictions] #restrictions-3',
      requireBoardSeat: '[data-auto-id=restrictions] #restrictions-4',
      requireLinkedTech: '[data-auto-id=restrictions] #restrictions-5',
      willParticipateInCompBids: '[data-auto-id=restrictions] #restrictions-6',
    },
    constructionRisks: {
      name: '[data-auto-id=constructionRisks] legend',
      greenfield: '[data-auto-id=constructionRisks] #constructionRisks-1',
      brownfield: '[data-auto-id=constructionRisks] #constructionRisks-2',
      operational: '[data-auto-id=constructionRisks] #constructionRisks-3',
    },
    minimumEquityPercentage: {
      name: '[data-auto-id=minimumEquityPercentage] legend',
      zeroPercent:
        '[data-auto-id=minimumEquityPercentage] #minimumEquityPercentage-1',
      oneTo19Percent:
        '[data-auto-id=minimumEquityPercentage] #minimumEquityPercentage-2',
      twentyTo49Percent:
        '[data-auto-id=minimumEquityPercentage] #minimumEquityPercentage-3',
      fiftyPercentPlus:
        '[data-auto-id=minimumEquityPercentage] #minimumEquityPercentage-4',
    },
    desiredDealRoles: {
      name: '[data-auto-id=desiredDealRoles] legend',
      leadManager: '[data-auto-id=desiredDealRoles] #desiredDealRoles-1',
      coLeadManager: '[data-auto-id=desiredDealRoles] #desiredDealRoles-2',
      coInvestor: '[data-auto-id=desiredDealRoles] #desiredDealRoles-3',
    },
    taskList: {
      dealTicketSize: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(1) .task-list__item-name',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(1) .task-list__item-incomplete',
        upTo49Million:
          '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(2)',
        fiftyTo99Million:
          '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(3)',
        oneHundredTo249Million:
          '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(4)',
        twoHundredFiftyTo499Million:
          '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(5)',
        fiveHundredTo999Million:
          '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(6)',
        oneBillionPlus:
          '[data-auto-id=investorRequirements] ul > li:nth-child(1) span:nth-child(7)',
      },
      assetClassesOfInterest: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(2) .task-list__item-name',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(2) .task-list__item-incomplete',
      },
      investmentTypes: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(3) .task-list__item-name',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) .task-list__item-incomplete',
        projectEquity:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) span:nth-child(2)',
        projectDebt:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) span:nth-child(3)',
        corporateEquity:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) span:nth-child(4)',
        corporateDebt:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) span:nth-child(5)',
        mezzanineDebt:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) span:nth-child(6)',
        ventureCapitalFunds:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) span:nth-child(7)',
        energyInfrastructure:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) span:nth-child(8)',
        privateEquity:
          '[data-auto-id=investorRequirements] ul > li:nth-child(3) span:nth-child(9)',
      },
      minimumReturnRate: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(4) .task-list__item-name',
        complete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(4) .task-list__item-complete',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(4) .task-list__item-incomplete',
      },
      timeHorizon: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(5) .task-list__item-name',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(5) .task-list__item-incomplete',
        upToFiveYears:
          '[data-auto-id=investorRequirements] ul > li:nth-child(5) span:nth-child(2)',
        fiveTo9Years:
          '[data-auto-id=investorRequirements]  ul > li:nth-child(5) span:nth-child(3)',
        tenTo14Years:
          '[data-auto-id=investorRequirements]  ul > li:nth-child(5) span:nth-child(4)',
        fifteenYearsPlus:
          '[data-auto-id=investorRequirements]  ul > li:nth-child(5) span:nth-child(5)',
      },
      restrictions: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(6) .task-list__item-name',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(6) .task-list__item-incomplete',
        liquidity:
          '[data-auto-id=investorRequirements] ul > li:nth-child(6) span:nth-child(2)',
        inflationAdjustment:
          '[data-auto-id=investorRequirements] ul > li:nth-child(6) span:nth-child(3)',
        requireFXHedge:
          '[data-auto-id=investorRequirements] ul > li:nth-child(6) span:nth-child(4)',
        requireBoardSeat:
          '[data-auto-id=investorRequirements] ul > li:nth-child(6) span:nth-child(5)',
        requireLinkedTech:
          '[data-auto-id=investorRequirements] ul > li:nth-child(6) span:nth-child(6)',
        willParticipateInCompBids:
          '[data-auto-id=investorRequirements] ul > li:nth-child(6) span:nth-child(7)',
      },
      constructionRisks: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(7) .task-list__item-name',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(7) .task-list__item-incomplete',
        greenfield:
          '[data-auto-id=investorRequirements] ul > li:nth-child(7) span:nth-child(2)',
        brownfield:
          '[data-auto-id=investorRequirements] ul > li:nth-child(7) span:nth-child(3)',
        operational:
          '[data-auto-id=investorRequirements] ul > li:nth-child(7) span:nth-child(4)',
      },
      minimumEquityPercentage: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(8) .task-list__item-name',
        complete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(8) .task-list__item-complete',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(8) .task-list__item-incomplete',
      },
      desiredDealRoles: {
        name: '[data-auto-id=investorRequirements] ul > li:nth-child(9) .task-list__item-name',
        incomplete:
          '[data-auto-id=investorRequirements] ul > li:nth-child(9) .task-list__item-incomplete',
        leadManager:
          '[data-auto-id=investorRequirements] ul > li:nth-child(9) span:nth-child(2)',
        coLeadManager:
          '[data-auto-id=investorRequirements] ul > li:nth-child(9) span:nth-child(3)',
        coInvestor:
          '[data-auto-id=investorRequirements] ul > li:nth-child(9) span:nth-child(4)',
      },
    },
  },
  location: {
    incompleteFields: '[data-auto-id=location] .incomplete-fields',
    summary: '[data-auto-id=location] summary',
    edit: '[data-auto-id=locationEdit]',
    save: '[data-auto-id=locationSave]',
    taskList: {
      ukLocationsOfInterest: {
        name: '[data-auto-id=location] ul > li:nth-child(1) .task-list__item-name',
        incomplete:
          '[data-auto-id=location] ul > li:nth-child(1) .task-list__item-incomplete',
        locationOne:
          '[data-auto-id="location"] > .govuk-details__text > .task-list > :nth-child(1) > :nth-child(2)',
        locationTwo:
          '[data-auto-id="location"] > .govuk-details__text > .task-list > :nth-child(1) > :nth-child(3)',
      },
      otherCountriesBeingConsidered: {
        name: '[data-auto-id=location] ul > li:nth-child(2) .task-list__item-name',
        incomplete:
          '[data-auto-id=location] ul > li:nth-child(2) .task-list__item-incomplete',
        locationOne:
          '[data-auto-id="location"] > .govuk-details__text > .task-list > :nth-child(2) > :nth-child(2)',
      },
      notesOnInvestorsLocationPreferences: {
        name: '[data-auto-id=location] ul > li:nth-child(3) .task-list__item-name',
        complete:
          '[data-auto-id="location"] ul > li:nth-child(3) .task-list__item-complete',
        incomplete:
          '[data-auto-id=location] ul > li:nth-child(3) .task-list__item-incomplete',
      },
    },
  },
}
