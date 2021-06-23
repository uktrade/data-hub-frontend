module.exports = {
  tabs: {
    investmentProjects: '[data-test="bodyMainContent"] li:nth-child(1)',
    largeCapitalProfile: '[data-test="bodyMainContent"] li:nth-child(2)',
    growthCapitalProfile: '[data-test="bodyMainContent"] li:nth-child(3)',
  },
  subHeading: '[data-test="bodyMainContent"] h2',
  createAProfile: '[data-test="bodyMainContent"] button',
  investorDetails: {
    incompleteFields: '[data-test=investorDetails] .incomplete-fields',
    summary: '[data-test=investorDetails] summary',
    edit: '[data-test="investorDetails"] [data-test=submit]',
    save: '[data-test=investorDetailsSave]',
    investorType: '[data-test=investorType]',
    globalAssetsUnderManagement: '[data-test=globalAssetsUnderManagement]',
    investableCapital: '[data-test=investableCapital]',
    investorDescription: '[data-test=investorDescription]',
    requiredChecks: {
      cleared: '[data-test=requiredChecks] #requiredChecks-1',
      clearedDay: '[data-test=requiredChecksCleared] #cleared-day',
      clearedMonth: '[data-test=requiredChecksCleared] #cleared-month',
      clearedYear: '[data-test=requiredChecksCleared] #cleared-year',
      issuesIdentified: '[data-test=requiredChecks] #requiredChecks-2',
      notYetChecked: '[data-test=requiredChecks] #requiredChecks-3',
      notRequired: '[data-test=requiredChecks] #requiredChecks-4',
      adviser: {
        placeHolder: '#conditional-requiredChecks-1 .multiselect__tags',
        textInput: '#conditional-requiredChecks-1 .multiselect__input',
        selectedOption: '#conditional-requiredChecks-1 .multiselect__single',
      },
    },
    taskList: {
      investorType: {
        name: '[data-test="investorDetails"] ul > li:nth-child(1) .task-list__item-name',
        complete:
          '[data-test="investorDetails"] ul > li:nth-child(1) .task-list__item-complete',
        incomplete:
          '[data-test="investorDetails"] ul > li:nth-child(1) .task-list__item-incomplete',
      },
      globalAssetsUnderManagement: {
        name: '[data-test="investorDetails"] ul > li:nth-child(2) .task-list__item-name',
        complete:
          '[data-test="investorDetails"] ul > li:nth-child(2) .task-list__item-complete',
        incomplete:
          '[data-test="investorDetails"] ul > li:nth-child(2) .task-list__item-incomplete',
      },
      investableCapital: {
        name: '[data-test="investorDetails"] ul > li:nth-child(3) .task-list__item-name',
        complete:
          '[data-test="investorDetails"] ul > li:nth-child(3) .task-list__item-complete',
        incomplete:
          '[data-test="investorDetails"] ul > li:nth-child(3) .task-list__item-incomplete',
      },
      investorDescription: {
        name: '[data-test="investorDetails"] ul > li:nth-child(4) .task-list__item-name',
        complete:
          '[data-test="investorDetails"] ul > li:nth-child(4) .task-list__item-complete',
        incomplete:
          '[data-test="investorDetails"] ul > li:nth-child(4) .task-list__item-incomplete',
      },
      requiredChecks: {
        name: '[data-test="investorDetails"] ul > li:nth-child(5) .task-list__item-name',
        complete:
          '[data-test="investorDetails"] ul > li:nth-child(5) .task-list__item-complete',
        completeDate:
          '[data-test="investorDetails"] ul > li:nth-child(5) span:nth-child(3)',
        adviser:
          '[data-test="investorDetails"] ul > li:nth-child(5) span:nth-child(4)',
        incomplete:
          '[data-test="investorDetails"] ul > li:nth-child(5) .task-list__item-incomplete',
      },
    },
  },
  investorRequirements: {
    incompleteFields: '[data-test=investorRequirements] .incomplete-fields',
    summary: '[data-test=investorRequirements] summary',
    edit: '[data-test="investorRequirements"] [data-test=submit]',
    save: '[data-test=investorRequirementsSave]',
    dealTicketSize: {
      name: '[data-test=dealTicketSizes] legend',
      upTo49Million: '[data-test=dealTicketSizes] #dealTicketSizes-1',
      fiftyTo99Million: '[data-test=dealTicketSizes] #dealTicketSizes-2',
      oneHundredTo249Million: '[data-test=dealTicketSizes] #dealTicketSizes-3',
      twoHundredFiftyTo499Million:
        '[data-test=dealTicketSizes] #dealTicketSizes-4',
      fiveHundredTo999Million: '[data-test=dealTicketSizes] #dealTicketSizes-5',
      oneBillionPlus: '[data-test=dealTicketSizes] #dealTicketSizes-6',
    },
    assetClasses: {
      name: '[data-test=assetClasses] .label',
      energyAndInfrastructure: {
        name: '[data-test=assetClasses] legend',
        biofuel: '[data-test=assetClasses] #energyAndInfrastructure-1',
        biomass: '[data-test=assetClasses] #energyAndInfrastructure-2',
        directHeating: '[data-test=assetClasses] #energyAndInfrastructure-3',
        energyFromWaste: '[data-test=assetClasses] #energyAndInfrastructure-4',
        energyStorage: '[data-test=assetClasses] #energyAndInfrastructure-5',
        gasFiredPower: '[data-test=assetClasses] #energyAndInfrastructure-6',
        nuclear: '[data-test=assetClasses] #energyAndInfrastructure-7',
        regulatedAssets: '[data-test=assetClasses] #energyAndInfrastructure-8',
        smartEnergy: '[data-test=assetClasses] #energyAndInfrastructure-9',
        solarPower: '[data-test=assetClasses] #energyAndInfrastructure-10',
        transport: '[data-test=assetClasses] #energyAndInfrastructure-11',
        waveAndTidal: '[data-test=assetClasses] #energyAndInfrastructure-12',
        windpowerOffshore:
          '[data-test=assetClasses] #energyAndInfrastructure-13',
        windpowerOnshore:
          '[data-test=assetClasses] #energyAndInfrastructure-14',
        upstreamOilAndGas:
          '[data-test=assetClasses] #energyAndInfrastructure-15',
      },
      realEstate: {
        name: '[data-test=assetClasses] legend',
        advancedManufactoring: '[data-test=assetClasses] #realEstate-1',
        commercialLed: '[data-test=assetClasses] #realEstate-2',
        dataCentre: '[data-test=assetClasses] #realEstate-3',
        gardenCities: '[data-test=assetClasses] #realEstate-4',
        hotel: '[data-test=assetClasses] #realEstate-5',
        leisure: '[data-test=assetClasses] #realEstate-6',
        lifeSciences: '[data-test=assetClasses] #realEstate-7',
        logistics: '[data-test=assetClasses] #realEstate-8',
        mixedUse: '[data-test=assetClasses] #realEstate-9',
        privateRentedSector: '[data-test=assetClasses] #realEstate-10',
        regeneration: '[data-test=assetClasses] #realEstate-11',
        researchAndDevelopment: '[data-test=assetClasses] #realEstate-12',
        residentialLed: '[data-test=assetClasses] #realEstate-13',
        retail: '[data-test=assetClasses] #realEstate-14',
        smartCities: '[data-test=assetClasses] #realEstate-15',
        studentHousing: '[data-test=assetClasses] #realEstate-16',
        transportHub: '[data-test=assetClasses] #realEstate-17',
      },
    },
    investmentTypes: {
      name: '[data-test=investmentTypes] legend',
      projectEquity: '[data-test=investmentTypes] #investmentTypes-1',
      projectDebt: '[data-test=investmentTypes] #investmentTypes-2',
      corporateEquity: '[data-test=investmentTypes] #investmentTypes-3',
      corporateDebt: '[data-test=investmentTypes] #investmentTypes-4',
      mezzanineDebt: '[data-test=investmentTypes] #investmentTypes-5',
      ventureCapitalFunds: '[data-test=investmentTypes] #investmentTypes-6',
      energyInfrastructure: '[data-test=investmentTypes] #investmentTypes-7',
      privateEquity: '[data-test=investmentTypes] #investmentTypes-8',
    },
    minimumReturnRate: {
      name: '[data-test=minimumReturnRate] legend',
      zeroTo5Percent: '[data-test=minimumReturnRate] #minimumReturnRate-1',
      fiveTo10Percent: '[data-test=minimumReturnRate] #minimumReturnRate-2',
      tenTo15Percent: '[data-test=minimumReturnRate] #minimumReturnRate-3',
      fifteenPercent: '[data-test=minimumReturnRate] #minimumReturnRate-4',
    },
    timeHorizons: {
      name: '[data-test=timeHorizons] legend',
      upToFiveYears: '[data-test=timeHorizons] #timeHorizons-1',
      fiveTo9Years: '[data-test=timeHorizons] #timeHorizons-2',
      tenTo14Years: '[data-test=timeHorizons] #timeHorizons-3',
      fifteenYearsPlus: '[data-test=timeHorizons] #timeHorizons-4',
    },
    restrictions: {
      name: '[data-test=restrictions] legend',
      liquidity: '[data-test=restrictions] #restrictions-1',
      inflationAdjustment: '[data-test=restrictions] #restrictions-2',
      requireFXHedge: '[data-test=restrictions] #restrictions-3',
      requireBoardSeat: '[data-test=restrictions] #restrictions-4',
      requireLinkedTech: '[data-test=restrictions] #restrictions-5',
      willParticipateInCompBids: '[data-test=restrictions] #restrictions-6',
    },
    constructionRisks: {
      name: '[data-test=constructionRisks] legend',
      greenfield: '[data-test=constructionRisks] #constructionRisks-1',
      brownfield: '[data-test=constructionRisks] #constructionRisks-2',
      operational: '[data-test=constructionRisks] #constructionRisks-3',
    },
    minimumEquityPercentage: {
      name: '[data-test=minimumEquityPercentage] legend',
      zeroPercent:
        '[data-test=minimumEquityPercentage] #minimumEquityPercentage-1',
      oneTo19Percent:
        '[data-test=minimumEquityPercentage] #minimumEquityPercentage-2',
      twentyTo49Percent:
        '[data-test=minimumEquityPercentage] #minimumEquityPercentage-3',
      fiftyPercentPlus:
        '[data-test=minimumEquityPercentage] #minimumEquityPercentage-4',
    },
    desiredDealRoles: {
      name: '[data-test=desiredDealRoles] legend',
      leadManager: '[data-test=desiredDealRoles] #desiredDealRoles-1',
      coLeadManager: '[data-test=desiredDealRoles] #desiredDealRoles-2',
      coInvestor: '[data-test=desiredDealRoles] #desiredDealRoles-3',
    },
    taskList: {
      dealTicketSize: {
        name: '[data-test=investorRequirements] ul > li:nth-child(1) .task-list__item-name',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(1) .task-list__item-incomplete',
        upTo49Million:
          '[data-test=investorRequirements] ul > li:nth-child(1) span:nth-child(2)',
        fiftyTo99Million:
          '[data-test=investorRequirements] ul > li:nth-child(1) span:nth-child(3)',
        oneHundredTo249Million:
          '[data-test=investorRequirements] ul > li:nth-child(1) span:nth-child(4)',
        twoHundredFiftyTo499Million:
          '[data-test=investorRequirements] ul > li:nth-child(1) span:nth-child(5)',
        fiveHundredTo999Million:
          '[data-test=investorRequirements] ul > li:nth-child(1) span:nth-child(6)',
        oneBillionPlus:
          '[data-test=investorRequirements] ul > li:nth-child(1) span:nth-child(7)',
      },
      assetClassesOfInterest: {
        name: '[data-test=investorRequirements] ul > li:nth-child(2) .task-list__item-name',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(2) .task-list__item-incomplete',
      },
      investmentTypes: {
        name: '[data-test=investorRequirements] ul > li:nth-child(3) .task-list__item-name',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(3) .task-list__item-incomplete',
        projectEquity:
          '[data-test=investorRequirements] ul > li:nth-child(3) span:nth-child(2)',
        projectDebt:
          '[data-test=investorRequirements] ul > li:nth-child(3) span:nth-child(3)',
        corporateEquity:
          '[data-test=investorRequirements] ul > li:nth-child(3) span:nth-child(4)',
        corporateDebt:
          '[data-test=investorRequirements] ul > li:nth-child(3) span:nth-child(5)',
        mezzanineDebt:
          '[data-test=investorRequirements] ul > li:nth-child(3) span:nth-child(6)',
        ventureCapitalFunds:
          '[data-test=investorRequirements] ul > li:nth-child(3) span:nth-child(7)',
        energyInfrastructure:
          '[data-test=investorRequirements] ul > li:nth-child(3) span:nth-child(8)',
        privateEquity:
          '[data-test=investorRequirements] ul > li:nth-child(3) span:nth-child(9)',
      },
      minimumReturnRate: {
        name: '[data-test=investorRequirements] ul > li:nth-child(4) .task-list__item-name',
        complete:
          '[data-test=investorRequirements] ul > li:nth-child(4) .task-list__item-complete',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(4) .task-list__item-incomplete',
      },
      timeHorizon: {
        name: '[data-test=investorRequirements] ul > li:nth-child(5) .task-list__item-name',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(5) .task-list__item-incomplete',
        upToFiveYears:
          '[data-test=investorRequirements] ul > li:nth-child(5) span:nth-child(2)',
        fiveTo9Years:
          '[data-test=investorRequirements]  ul > li:nth-child(5) span:nth-child(3)',
        tenTo14Years:
          '[data-test=investorRequirements]  ul > li:nth-child(5) span:nth-child(4)',
        fifteenYearsPlus:
          '[data-test=investorRequirements]  ul > li:nth-child(5) span:nth-child(5)',
      },
      restrictions: {
        name: '[data-test=investorRequirements] ul > li:nth-child(6) .task-list__item-name',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(6) .task-list__item-incomplete',
        liquidity:
          '[data-test=investorRequirements] ul > li:nth-child(6) span:nth-child(2)',
        inflationAdjustment:
          '[data-test=investorRequirements] ul > li:nth-child(6) span:nth-child(3)',
        requireFXHedge:
          '[data-test=investorRequirements] ul > li:nth-child(6) span:nth-child(4)',
        requireBoardSeat:
          '[data-test=investorRequirements] ul > li:nth-child(6) span:nth-child(5)',
        requireLinkedTech:
          '[data-test=investorRequirements] ul > li:nth-child(6) span:nth-child(6)',
        willParticipateInCompBids:
          '[data-test=investorRequirements] ul > li:nth-child(6) span:nth-child(7)',
      },
      constructionRisks: {
        name: '[data-test=investorRequirements] ul > li:nth-child(7) .task-list__item-name',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(7) .task-list__item-incomplete',
        greenfield:
          '[data-test=investorRequirements] ul > li:nth-child(7) span:nth-child(2)',
        brownfield:
          '[data-test=investorRequirements] ul > li:nth-child(7) span:nth-child(3)',
        operational:
          '[data-test=investorRequirements] ul > li:nth-child(7) span:nth-child(4)',
      },
      minimumEquityPercentage: {
        name: '[data-test=investorRequirements] ul > li:nth-child(8) .task-list__item-name',
        complete:
          '[data-test=investorRequirements] ul > li:nth-child(8) .task-list__item-complete',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(8) .task-list__item-incomplete',
      },
      desiredDealRoles: {
        name: '[data-test=investorRequirements] ul > li:nth-child(9) .task-list__item-name',
        incomplete:
          '[data-test=investorRequirements] ul > li:nth-child(9) .task-list__item-incomplete',
        leadManager:
          '[data-test=investorRequirements] ul > li:nth-child(9) span:nth-child(2)',
        coLeadManager:
          '[data-test=investorRequirements] ul > li:nth-child(9) span:nth-child(3)',
        coInvestor:
          '[data-test=investorRequirements] ul > li:nth-child(9) span:nth-child(4)',
      },
    },
  },
  location: {
    incompleteFields: '[data-test=location] .incomplete-fields',
    summary: '[data-test=location] summary',
    edit: '[data-test="location"] [data-test=submit]',
    save: '[data-test=locationSave]',
    taskList: {
      ukLocationsOfInterest: {
        name: '[data-test=location] ul > li:nth-child(1) .task-list__item-name',
        incomplete:
          '[data-test=location] ul > li:nth-child(1) .task-list__item-incomplete',
        locationOne:
          '[data-test="location"] > .govuk-details__text > .task-list > :nth-child(1) > :nth-child(2)',
        locationTwo:
          '[data-test="location"] > .govuk-details__text > .task-list > :nth-child(1) > :nth-child(3)',
      },
      otherCountriesBeingConsidered: {
        name: '[data-test=location] ul > li:nth-child(2) .task-list__item-name',
        incomplete:
          '[data-test=location] ul > li:nth-child(2) .task-list__item-incomplete',
        locationOne:
          '[data-test="location"] > .govuk-details__text > .task-list > :nth-child(2) > :nth-child(2)',
      },
      notesOnInvestorsLocationPreferences: {
        name: '[data-test=location] ul > li:nth-child(3) .task-list__item-name',
        complete:
          '[data-test="location"] ul > li:nth-child(3) .task-list__item-complete',
        incomplete:
          '[data-test=location] ul > li:nth-child(3) .task-list__item-incomplete',
      },
    },
  },
}
