const { companyInvestment: selectors } = require('../../../../../selectors')
const fixtures = require('../../../fixtures')

const baseUrl = Cypress.config().baseUrl
const { oneListCorp, lambdaPlc } = fixtures.company
const largeCapitalProfile = `/companies/${oneListCorp.id}/investments/large-capital-profile`
const largeCapitalProfileNew = `/companies/${lambdaPlc.id}/investments/large-capital-profile`

describe('Company Investments and Large capital profile', () => {
  context('when viewing the company header', () => {
    before(() => cy.visit(largeCapitalProfile))
  })

  context('when viewing the 3 tabs', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Large capitail profile - One List Corp - Companies - DIT Data Hub'
      )
    })

    it('should display an "Investments projects" tab with the correct URL', () => {
      cy.get(selectors.tabs.investmentProjects)
        .find('a')
        .should('have.prop', 'href')
        .and(
          'equal',
          `${baseUrl}/companies/${oneListCorp.id}/investments/projects`
        )
    })

    it('should display a "Large capital profile" tab with the correct URL', () => {
      cy.get(selectors.tabs.largeCapitalProfile)
        .find('a')
        .should('have.prop', 'href')
        .and(
          'equal',
          `${baseUrl}/companies/${oneListCorp.id}/investments/large-capital-profile`
        )
    })
  })

  context('when the Large capital profile tab is selected', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should not have an "active" class on the "Investment projects" tab', () => {
      cy.get(selectors.tabs.investmentProjects).should(
        'not.have.class',
        'active'
      )
    })

    it('should have an "active" class on the "Large capital profile" tab', () => {
      cy.get(selectors.tabs.largeCapitalProfile).should('have.class', 'active')
    })
  })

  context('when viewing the tabbed area content', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should display the "Large capital investor profile" subheading', () => {
      cy.get(selectors.subHeading).should(
        'have.text',
        'Large capital investor profile'
      )
    })
  })

  context('when clicking on a profile summary', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should expand the "Investor details" summary and have an enabled edit button', () => {
      cy.get(selectors.investorDetails.summary)
        .click()
        .get(selectors.investorDetails.edit)
        .should('be.visible')
        .should('be.not.disabled')
    })

    it('should expand the "Investor requirements" summary and have an enabled edit button', () => {
      cy.get(selectors.investorRequirements.summary)
        .click()
        .get(selectors.investorRequirements.edit)
        .should('be.visible')
        .should('be.not.disabled')
    })

    it('should expand the "Location" summary and have an enabled edit button', () => {
      cy.get(selectors.location.summary)
        .click()
        .get(selectors.location.edit)
        .should('be.visible')
        .should('be.not.disabled')
    })
  })

  context('when editing the "Investor details" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor requirements" and "Location" edit button', () => {
      cy.get(selectors.investorDetails.edit)
        .click()
        .get(selectors.investorRequirements.edit)
        .should('be.disabled')
        .get(selectors.location.edit)
        .should('be.disabled')
    })
  })

  context('when editing the "Investor requirements" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor details" and "Location" edit button', () => {
      cy.get(selectors.investorRequirements.edit)
        .click()
        .get(selectors.investorDetails.edit)
        .should('be.disabled')
        .get(selectors.location.edit)
        .should('be.disabled')
    })
  })

  context('when editing the "Location" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor details" and "Investor requirements" edit button', () => {
      cy.get(selectors.location.edit)
        .click()
        .get(selectors.investorDetails.edit)
        .should('be.disabled')
        .get(selectors.investorRequirements.edit)
        .should('be.disabled')
    })
  })

  context('when viewing the incomplete fields on each summary', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should display "1 field incomplete"', () => {
      cy.get(selectors.investorDetails.incompleteFields).should(
        'contain',
        '1 field incomplete'
      )
    })

    it('should display "9 fields incomplete"', () => {
      cy.get(selectors.investorRequirements.incompleteFields).should(
        'contain',
        '9 fields incomplete'
      )
    })

    it('should display "2 fields incomplete"', () => {
      cy.get(selectors.location.incompleteFields).should(
        'contain',
        '2 fields incomplete'
      )
    })
  })

  context(
    'when viewing a single incomplete field within "Investor details"',
    () => {
      before(() => cy.visit(largeCapitalProfile))

      it(`should display both Investor description and INCOMPLETE`, () => {
        cy.get(
          selectors.investorDetails.taskList.investorDescription.name
        ).should('contain', 'Investor description')
        cy.get(
          selectors.investorDetails.taskList.investorDescription.incomplete
        ).should('contain', 'INCOMPLETE')
      })
    }
  )

  context(
    'when viewing all incomplete fields within "Investor details"',
    () => {
      const { taskList } = selectors.investorDetails
      const labels = [
        'Investor type',
        'Global assets under management',
        'Investable capital',
        'Investor description',
        'Has this investor cleared the required checks within the last 12 months?',
      ]

      before(() => cy.visit(largeCapitalProfileNew))

      Object.keys(taskList).forEach((key, index) => {
        it(`should display both ${labels[index]} and INCOMPLETE`, () => {
          cy.get(taskList[key].name).should('contain', labels[index])
          cy.get(taskList[key].incomplete).should('contain', 'INCOMPLETE')
        })
      })
    }
  )

  context(
    'when viewing all incomplete fields within "Investor requirements"',
    () => {
      const { taskList } = selectors.investorRequirements
      const labels = [
        'Deal ticket size',
        'Asset classes of interest',
        'Types of investment',
        'Minimum return rate',
        'Time horizon / tenor',
        'Restrictions / conditions',
        'Construction risk',
        'Minimum equity percentage',
        'Desired deal role',
      ]

      before(() => cy.visit(largeCapitalProfileNew))

      Object.keys(taskList).forEach((key, index) => {
        it(`should display both ${labels[index]} and INCOMPLETE`, () => {
          cy.get(taskList[key].name).should('contain', labels[index])
          cy.get(taskList[key].incomplete).should('contain', 'INCOMPLETE')
        })
      })
    }
  )

  context('when viewing all incomplete fields within "Location"', () => {
    const { taskList } = selectors.location
    const labels = [
      'UK locations of interest',
      'Other countries the investor is considering',
      "Notes on investor's location preferences",
    ]

    before(() => cy.visit(largeCapitalProfileNew))

    Object.keys(taskList).forEach((key, index) => {
      it(`should display both ${labels[index]} and INCOMPLETE`, () => {
        cy.get(taskList[key].name).should('contain', labels[index])
        cy.get(taskList[key].incomplete).should('contain', 'INCOMPLETE')
      })
    })
  })

  context('when viewing the "Investor details" section', () => {
    const { investorDetails } = selectors

    const type = 'Cleared'
    const date = 'Date of most recent background checks: 29 04 2019'
    const adviser =
      'Person responsible for most recent background checks: Aaron Chan'

    it('should display all the field values apart from "Investor Description"', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorDetails.summary)
        .click()
        .get(investorDetails.taskList.investorType.complete)
        .should('contain', 'Asset manager')
        .get(investorDetails.taskList.globalAssetsUnderManagement.complete)
        .should('contain', 1000000)
        .get(investorDetails.taskList.investableCapital.complete)
        .should('contain', 30000)
        .get(investorDetails.taskList.investorDescription.incomplete)
        .should('contain', 'INCOMPLETE')
        .get(investorDetails.taskList.requiredChecks.complete)
        .should('contain', type)
        .get(investorDetails.taskList.requiredChecks.completeDate)
        .should('contain', date)
        .get(investorDetails.taskList.requiredChecks.adviser)
        .should('contain', adviser)
    })
  })

  context('when viewing the "Investor details" edit section', () => {
    const { investorDetails } = selectors
    const adviser = 'Seth Hernandez, Callie Taylor'

    it('should display all the field values apart from "Investor Description"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-details`)
        .get(investorDetails.investorType)
        .should('contain', 'Asset manager')
        .get(investorDetails.globalAssetsUnderManagement)
        .should('have.value', '1000000')
        .get(investorDetails.investableCapital)
        .should('have.value', '30000')
        .get(investorDetails.investorDescription)
        .should('have.value', '')
        .get(investorDetails.requiredChecks.cleared)
        .should('be.checked')
        .get(investorDetails.requiredChecks.clearedDay)
        .should('have.value', '29')
        .get(investorDetails.requiredChecks.clearedMonth)
        .should('have.value', '4')
        .get(investorDetails.requiredChecks.clearedYear)
        .should('have.value', '2019')
        .get(investorDetails.requiredChecks.adviser.placeHolder)
        .should('contain', adviser)
    })
  })

  context('When interacting with the Adviser typeahead', () => {
    const { investorDetails } = selectors

    it('should be able to select an Adviser', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-details`)
        .get(investorDetails.requiredChecks.adviser.placeHolder)
        .click()
        .get(investorDetails.requiredChecks.adviser.textInput)
        .type('Seth')
        .wait(500)
        .get(investorDetails.requiredChecks.adviser.textInput)
        .type('{downarrow}')
        .get(investorDetails.requiredChecks.adviser.textInput)
        .type('{enter}')
        .get(investorDetails.requiredChecks.adviser.selectedOption)
        .should('contain', 'Seth Hernandez, Callie Taylor')
    })
  })

  context('when viewing the "Investor requirements" edit section', () => {
    const { investorRequirements } = selectors

    it('should display "Deal ticket size" and all 6 checkboxes should be checked', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.dealTicketSize.name)
        .should('contain', 'Deal ticket size')
        .get(investorRequirements.dealTicketSize.upTo49Million)
        .should('be.checked')
        .get(investorRequirements.dealTicketSize.fiftyTo99Million)
        .should('be.checked')
        .get(investorRequirements.dealTicketSize.oneHundredTo249Million)
        .should('be.checked')
        .get(investorRequirements.dealTicketSize.twoHundredFiftyTo499Million)
        .should('be.checked')
        .get(investorRequirements.dealTicketSize.fiveHundredTo999Million)
        .should('be.checked')
        .get(investorRequirements.dealTicketSize.oneBillionPlus)
        .should('be.checked')
    })

    context(
      'should display "Energy and Infrastructure" and contain 15 checkboxes',
      () => {
        const { assetClasses } = selectors.investorRequirements

        const labels = [
          'Energy and Infrastructure',
          'Biofuel',
          'Biomass',
          'Direct heating',
          'Energy from waste',
          'Energy storage',
          'Gas fired power',
          'Nuclear',
          'Regulated assets',
          'Smart energy',
          'Solar power',
          'Transport',
          'Wave and tidal',
          'Windpower (offshore)',
          'Windpower (onshore)',
          'Upstream oil and gas',
        ]

        before(() =>
          cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        )

        Object.keys(assetClasses.energyAndInfrastructure).forEach(
          (key, index) => {
            if (index === 0) {
              it(`should display the heading "Energy and Infrastructure"`, () => {
                cy.get(assetClasses.energyAndInfrastructure[key]).should(
                  'contain',
                  labels[index]
                )
              })
            } else {
              it(`should display the ${labels[index]} checkbox label and it should be checked`, () => {
                cy.get(assetClasses.energyAndInfrastructure[key]).should(
                  'be.checked'
                )
                cy.get(
                  `${assetClasses.energyAndInfrastructure[key]} + label`
                ).should('contain', labels[index])
              })
            }
          }
        )
      }
    )

    context('should display "Real estate" and contain 17 checkboxes', () => {
      const { assetClasses } = selectors.investorRequirements

      const labels = [
        'Real estate',
        'Advanced manufacturing',
        'Commerical led',
        'Data centre',
        'Garden cities',
        'Hotel',
        'Lesuire',
        'Life sciences',
        'Logistics',
        'Mixed use',
        'Private rented sector',
        'Regeneration',
        'Research and development',
        'Residential led',
        'Retail',
        'Smart cities',
        'Student housing',
        'Transport hub / rail',
      ]

      before(() =>
        cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
      )

      Object.keys(assetClasses.realEstate).forEach((key, index) => {
        if (index === 0) {
          it(`should display the heading "Real estate"`, () => {
            cy.get(assetClasses.realEstate[key]).should(
              'contain',
              labels[index]
            )
          })
        } else {
          it(`should display the ${labels[index]} checkbox label and it should be checked`, () => {
            cy.get(assetClasses.realEstate[key]).should('be.checked')
            cy.get(`${assetClasses.realEstate[key]} + label`).should(
              'contain',
              labels[index]
            )
          })
        }
      })
    })

    it('should display "Types of investment" and all 8 checkboxes should be checked"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.investmentTypes.name)
        .should('contain', 'Types of investment')
        .get(investorRequirements.investmentTypes.projectEquity)
        .should('be.checked')
        .get(investorRequirements.investmentTypes.projectDebt)
        .should('be.checked')
        .get(investorRequirements.investmentTypes.corporateEquity)
        .should('be.checked')
        .get(investorRequirements.investmentTypes.corporateDebt)
        .should('be.checked')
        .get(investorRequirements.investmentTypes.mezzanineDebt)
        .should('be.checked')
        .get(investorRequirements.investmentTypes.ventureCapitalFunds)
        .should('be.checked')
        .get(investorRequirements.investmentTypes.energyInfrastructure)
        .should('be.checked')
        .get(investorRequirements.investmentTypes.privateEquity)
        .should('be.checked')
    })

    it('should display "Minimum return rate" and the radio button "10-15%" should be checked"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.minimumReturnRate.name)
        .should('contain', 'Minimum return rate')
        .get(investorRequirements.minimumReturnRate.tenTo15Percent)
        .should('be.checked')
    })

    it('should display "Time Horizon / tenor" and all 4 checkboxes should be checked"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.timeHorizons.name)
        .should('contain', 'Time horizon / tenor')
        .get(investorRequirements.timeHorizons.upToFiveYears)
        .should('be.checked')
        .get(investorRequirements.timeHorizons.fiveTo9Years)
        .should('be.checked')
        .get(investorRequirements.timeHorizons.tenTo14Years)
        .should('be.checked')
        .get(investorRequirements.timeHorizons.fifteenYearsPlus)
        .should('be.checked')
    })

    it('should display "Restrictions / conditions" and all 6 checkboxes should be checked"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.restrictions.name)
        .should('contain', 'Restrictions / conditions')
        .get(investorRequirements.restrictions.liquidity)
        .should('be.checked')
        .get(investorRequirements.restrictions.inflationAdjustment)
        .should('be.checked')
        .get(investorRequirements.restrictions.requireFXHedge)
        .should('be.checked')
        .get(investorRequirements.restrictions.requireBoardSeat)
        .should('be.checked')
        .get(investorRequirements.restrictions.requireLinkedTech)
        .should('be.checked')
        .get(investorRequirements.restrictions.willParticipateInCompBids)
        .should('be.checked')
    })

    it('should display "Construction risk" and all 3 checkboxes should be checked"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.constructionRisks.name)
        .should('contain', 'Construction risk')
        .get(investorRequirements.constructionRisks.greenfield)
        .should('be.checked')
        .get(investorRequirements.constructionRisks.brownfield)
        .should('be.checked')
        .get(investorRequirements.constructionRisks.operational)
        .should('be.checked')
    })

    it('should display "Minimum equity percentage" and the radio button "20-49%"" should be checked"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.minimumEquityPercentage.name)
        .should('contain', 'Minimum equity percentage')
        .get(investorRequirements.minimumEquityPercentage.twentyTo49Percent)
        .should('be.checked')
    })

    it('should display "Desired deal role" and all 3 checkboxes should be checked"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.desiredDealRoles.name)
        .should('contain', 'Desired deal role')
        .get(investorRequirements.desiredDealRoles.leadManager)
        .should('be.checked')
        .get(investorRequirements.desiredDealRoles.coLeadManager)
        .should('be.checked')
        .get(investorRequirements.desiredDealRoles.coInvestor)
        .should('be.checked')
    })
  })

  context('when viewing the "Investor requirements" details section', () => {
    const { investorRequirements } = selectors

    it('should display "Deal ticket size" and all 6 sizes', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary)
        .click()
        .get(investorRequirements.taskList.dealTicketSize.name)
        .should('contain', 'Deal ticket size')
        .get(investorRequirements.taskList.dealTicketSize.upTo49Million)
        .should('contain', 'Up to £49 million')
        .get(investorRequirements.taskList.dealTicketSize.fiftyTo99Million)
        .should('contain', '£50-99 million')
        .get(
          investorRequirements.taskList.dealTicketSize.oneHundredTo249Million
        )
        .should('contain', '£100-249 million')
        .get(
          investorRequirements.taskList.dealTicketSize
            .twoHundredFiftyTo499Million
        )
        .should('contain', '£250-499 million')
        .get(
          investorRequirements.taskList.dealTicketSize.fiveHundredTo999Million
        )
        .should('contain', '£500-999 million')
        .get(investorRequirements.taskList.dealTicketSize.oneBillionPlus)
        .should('contain', '£1 billion +')
    })

    it('should display "Types of investment" and all 8 investments', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary)
        .click()
        .get(investorRequirements.taskList.investmentTypes.name)
        .should('contain', 'Types of investment')
        .get(investorRequirements.taskList.investmentTypes.projectEquity)
        .should('contain', 'Direct Investment in Project Equity')
        .get(investorRequirements.taskList.investmentTypes.projectDebt)
        .should('contain', 'Direct Investment in Project Debt')
        .get(investorRequirements.taskList.investmentTypes.corporateEquity)
        .should('contain', 'Direct Investment in Corporate Equity')
        .get(investorRequirements.taskList.investmentTypes.corporateDebt)
        .should('contain', 'Direct Investment in Corporate Debt')
        .get(investorRequirements.taskList.investmentTypes.mezzanineDebt)
        .should(
          'contain',
          'Mezzanine Debt (incl. preferred shares, convertibles'
        )
        .get(investorRequirements.taskList.investmentTypes.ventureCapitalFunds)
        .should('contain', 'Venture capital funds')
        .get(investorRequirements.taskList.investmentTypes.energyInfrastructure)
        .should(
          'contain',
          'Energy / Infrastructure / Real Estate Funds (UKEIREFs)'
        )
        .get(investorRequirements.taskList.investmentTypes.privateEquity)
        .should('contain', 'Private Equity / Venture Capital')
    })

    it('should display "Minimum return rate" and "10-15%"', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary)
        .click()
        .get(investorRequirements.taskList.minimumReturnRate.name)
        .should('contain', 'Minimum return rate')
        .get(investorRequirements.taskList.minimumReturnRate.complete)
        .should('contain', '10-15%')
    })

    it('should display "Time horizon / tenor" and all 4 times', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary)
        .click()
        .get(investorRequirements.taskList.timeHorizon.name)
        .should('contain', 'Time horizon / tenor')
        .get(investorRequirements.taskList.timeHorizon.upToFiveYears)
        .should('contain', 'Up to 5 years')
        .get(investorRequirements.taskList.timeHorizon.fiveTo9Years)
        .should('contain', '5-9 years')
        .get(investorRequirements.taskList.timeHorizon.tenTo14Years)
        .should('contain', '10-14 years')
        .get(investorRequirements.taskList.timeHorizon.fifteenYearsPlus)
        .should('contain', '15 years +')
    })

    it('should display "Restrictions / conditions" and all 6 restrictions', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary)
        .click()
        .get(investorRequirements.taskList.restrictions.name)
        .should('contain', 'Restrictions / conditions')
        .get(investorRequirements.taskList.restrictions.liquidity)
        .should('contain', 'Liquidity / exchange listing')
        .get(investorRequirements.taskList.restrictions.inflationAdjustment)
        .should('contain', 'Inflation adjustment')
        .get(investorRequirements.taskList.restrictions.requireFXHedge)
        .should('contain', 'Require FX hedge')
        .get(investorRequirements.taskList.restrictions.requireBoardSeat)
        .should('contain', 'Require board seat')
        .get(investorRequirements.taskList.restrictions.requireLinkedTech)
        .should('contain', 'Require linked technology / knowledge transfer')
        .get(
          investorRequirements.taskList.restrictions.willParticipateInCompBids
        )
        .should('contain', 'Will participate in competitive bids / auctions')
    })

    it('should display "Construction risk" and all 3 risks', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary)
        .click()
        .get(investorRequirements.taskList.constructionRisks.name)
        .should('contain', 'Construction risk')
        .get(investorRequirements.taskList.constructionRisks.greenfield)
        .should('contain', 'Greenfield (construction risk)')
        .get(investorRequirements.taskList.constructionRisks.brownfield)
        .should('contain', 'Brownfield (some construction risk)')
        .get(investorRequirements.taskList.constructionRisks.operational)
        .should('contain', 'Operational (no construction risk)')
    })

    it('should display "Minimum equity percentage" and "20-49%"', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary)
        .click()
        .get(investorRequirements.taskList.minimumEquityPercentage.name)
        .should('contain', 'Minimum equity percentage')
        .get(investorRequirements.taskList.minimumEquityPercentage.complete)
        .should('contain', '20-49%')
    })

    it('should display "Desired deal role" and all 3 roles', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary)
        .click()
        .get(investorRequirements.taskList.desiredDealRoles.name)
        .should('contain', 'Desired deal role')
        .get(investorRequirements.taskList.desiredDealRoles.leadManager)
        .should('contain', 'Lead manager / deal structure')
        .get(investorRequirements.taskList.desiredDealRoles.coLeadManager)
        .should('contain', 'Co-lead manager')
        .get(investorRequirements.taskList.desiredDealRoles.coInvestor)
        .should('contain', 'Co-investor / syndicate member')
    })
  })

  context('when viewing the "Location" details section', () => {
    const { location } = selectors

    it("should display 'Notes on investor's location preferences' and the text within the notes", () => {
      cy.visit(largeCapitalProfile)
        .get(location.summary)
        .click()
        .get(location.taskList.notesOnInvestorsLocationPreferences.name)
        .should('contain', "Notes on investor's location preferences")
        .get(location.taskList.notesOnInvestorsLocationPreferences.complete)
        .should('contain', 'Notes go here please')
    })

    it("should display 'UK locations of interest' and London and the West Midlands", () => {
      cy.visit(largeCapitalProfile)
        .get(location.summary)
        .click()
        .get(location.taskList.ukLocationsOfInterest.name)
        .should('contain', 'UK locations of interest')
        .get(location.taskList.ukLocationsOfInterest.locationOne)
        .should('contain', 'London')
        .get(location.taskList.ukLocationsOfInterest.locationTwo)
        .should('contain', 'West Midlands')
    })

    it("should display 'Other countries the investor is considering' and Japan", () => {
      cy.visit(largeCapitalProfile)
        .get(location.summary)
        .click()
        .get(location.taskList.otherCountriesBeingConsidered.name)
        .should('contain', 'Other countries the investor is considering')
        .get(location.taskList.otherCountriesBeingConsidered.locationOne)
        .should('contain', 'Japan')
    })
  })
})

const visitLargeCapitalProfileAndExpandAllSections = () => {
  cy.visit(largeCapitalProfile)
    .get(selectors.investorDetails.summary)
    .click()
    .get(selectors.investorRequirements.summary)
    .click()
    .get(selectors.location.summary)
    .click()
}
