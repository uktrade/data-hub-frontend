const { localHeader, companyInvestment: selectors } = require('../../../selectors')
const fixtures = require('../../../fixtures/index.js')
const baseUrl = Cypress.config().baseUrl
const { oneListCorp, lambdaPlc } = fixtures.company
const largeCapitalProfile = `/companies/${oneListCorp.id}/investments/large-capital-profile`
const largeCapitalProfileNew = `/companies/${lambdaPlc.id}/investments/large-capital-profile`

describe('Company Investments and Large capital profile', () => {
  context('when viewing the company header', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should display the "One List Corp" heading', () => {
      cy.get(localHeader().heading).should('have.text', 'One List Corp')
    })
  })

  context('when viewing the 3 tabs', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should display an "Investments projects" tab with the correct URL', () => {
      cy.get(selectors.tabs.investmentProjects).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/projects`)
    })

    it('should display a "Large capital profile" tab with the correct URL', () => {
      cy.get(selectors.tabs.largeCapitalProfile).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/large-capital-profile`)
    })

    it('should display a "Growth capital profile" tab with the correct URL', () => {
      cy.get(selectors.tabs.growthCapitalProfile).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/growth-capital-profile`)
    })
  })

  context('when the Large capital profile tab is selected', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should not have an "active" class on the "Investment projects" tab', () => {
      cy.get(selectors.tabs.investmentProjects).should('not.have.class', 'active')
    })

    it('should have an "active" class on the "Large capital profile" tab', () => {
      cy.get(selectors.tabs.largeCapitalProfile).should('have.class', 'active')
    })

    it('should not have an "active" class on the "Growth capital profile" tab', () => {
      cy.get(selectors.tabs.growthCapitalProfile).should('not.have.class', 'active')
    })
  })

  context('when viewing the tabbed area content', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should display the "Large capital investor profile" subheading', () => {
      cy.get(selectors.subHeading).should('have.text', 'Large capital investor profile')
    })
  })

  context('when clicking on a profile summary', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should expand the "Investor details" summary and have an enabled edit button', () => {
      cy.get(selectors.investorDetails.summary).click()
        .get(selectors.investorDetails.edit).should('be.visible').should('be.not.disabled')
    })

    it('should expand the "Investor requirements" summary and have an enabled edit button', () => {
      cy.get(selectors.investorRequirements.summary).click()
        .get(selectors.investorRequirements.edit).should('be.visible').should('be.not.disabled')
    })

    it('should expand the "Location" summary and have an enabled edit button', () => {
      cy.get(selectors.location.summary).click()
        .get(selectors.location.edit).should('be.visible').should('be.not.disabled')
    })
  })

  context('when editing the "Investor details" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor requirements" and "Location" edit button', () => {
      cy.get(selectors.investorDetails.edit).click()
        .get(selectors.investorRequirements.edit).should('be.disabled')
        .get(selectors.location.edit).should('be.disabled')
    })
  })

  context('when editing the "Investor requirements" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor details" and "Location" edit button', () => {
      cy.get(selectors.investorRequirements.edit).click()
        .get(selectors.investorDetails.edit).should('be.disabled')
        .get(selectors.location.edit).should('be.disabled')
    })
  })

  context('when editing the "Location" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor details" and "Investor requirements" edit button', () => {
      cy.get(selectors.location.edit).click()
        .get(selectors.investorDetails.edit).should('be.disabled')
        .get(selectors.investorRequirements.edit).should('be.disabled')
    })
  })

  context('when viewing the incomplete fields on each summary', () => {
    before(() => cy.visit(largeCapitalProfile))

    it('should display "1 field incomplete"', () => {
      cy.get(selectors.investorDetails.incompleteFields).should('contain', '1 field incomplete')
    })

    it('should display "9 fields incomplete"', () => {
      cy.get(selectors.investorRequirements.incompleteFields).should('contain', '9 fields incomplete')
    })

    it('should display "3 fields incomplete"', () => {
      cy.get(selectors.location.incompleteFields).should('contain', '3 fields incomplete')
    })
  })

  context('when viewing a single incomplete field within "Investor details"', () => {
    before(() => cy.visit(largeCapitalProfile))

    it(`should display both Investor description and INCOMPLETE`, () => {
      cy.get(selectors.investorDetails.taskList.investorDescription.name).should('contain', 'Investor description')
      cy.get(selectors.investorDetails.taskList.investorDescription.incomplete).should('contain', 'INCOMPLETE')
    })
  })

  context('when viewing all incomplete fields within "Investor requirements"', () => {
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
  })

  context('when viewing all incomplete fields within "Location"', () => {
    const { taskList } = selectors.location
    const labels = [
      'UK locations of interest',
      'Other countries the investor is considering',
      'Notes on investor\'s location preferences',
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
    const adviser = 'Person responsible for most recent background checks: Aaron Chan'

    it('should display all the field values apart from "Investor Description"', () => {
      cy.visit(largeCapitalProfile).get(selectors.investorDetails.summary).click()
        .get(investorDetails.taskList.investorType.complete).should('contain', 'Asset manager')
        .get(investorDetails.taskList.globalAssetsUnderManagement.complete).should('contain', 1000000)
        .get(investorDetails.taskList.investableCapital.complete).should('contain', 30000)
        .get(investorDetails.taskList.investorDescription.incomplete).should('contain', 'INCOMPLETE')
        .get(investorDetails.taskList.requiredChecks.complete).should('contain', type)
        .get(investorDetails.taskList.requiredChecks.completeDate).should('contain', date)
        .get(investorDetails.taskList.requiredChecks.adviser).should('contain', adviser)
    })
  })

  context('when viewing the "Investor details" edit section', () => {
    const { investorDetails } = selectors
    const adviser = 'Aaron Chan, British Embassy Manila Philippines'

    it('should display all the field values apart from "Investor Description"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-details`)
        .get(investorDetails.investorType).should('contain', 'Asset manager')
        .get(investorDetails.globalAssetsUnderManagement).should('have.value', '1000000')
        .get(investorDetails.investableCapital).should('have.value', '30000')
        .get(investorDetails.investorDescription).should('have.value', '')
        .get(investorDetails.requiredChecks.cleared).should('be.checked')
        .get(investorDetails.requiredChecks.clearedDay).should('have.value', '29')
        .get(investorDetails.requiredChecks.clearedMonth).should('have.value', '4')
        .get(investorDetails.requiredChecks.clearedYear).should('have.value', '2019')
        .get(investorDetails.requiredChecks.adviser.placeHolder).should('contain', adviser)
    })
  })

  context('When interacting with the Adviser typeahead', () => {
    const { investorDetails } = selectors

    it('should be able to select an Adviser', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-details`)
        .get(investorDetails.requiredChecks.adviser.placeHolder).click()
        .get(investorDetails.requiredChecks.adviser.textInput).type('abby').wait(500)
        .get(investorDetails.requiredChecks.adviser.textInput).type('{downarrow}')
        .get(investorDetails.requiredChecks.adviser.textInput).type('{enter}')
        .get(investorDetails.requiredChecks.adviser.selectedOption)
        .should('contain', 'Abby Chan, British High Commission Singapore')
    })
  })

  context('when viewing the "Investor requirements" edit section', () => {
    const { investorRequirements } = selectors

    it('should select all "Deal ticket sizes"', () => {
      cy.visit(`${largeCapitalProfile}?editing=investor-requirements`)
        .get(investorRequirements.dealTicketSize.upTo49Million).should('be.checked')
        .get(investorRequirements.dealTicketSize.fiftyTo99Million).should('be.checked')
        .get(investorRequirements.dealTicketSize.oneHundredTo249Million).should('be.checked')
        .get(investorRequirements.dealTicketSize.twoHundredFiftyTo499Million).should('be.checked')
        .get(investorRequirements.dealTicketSize.fiveHundredTo999Million).should('be.checked')
        .get(investorRequirements.dealTicketSize.oneBillionPlus).should('be.checked')
    })
  })

  context('when viewing the "Investor requirements" details section', () => {
    const { investorRequirements } = selectors

    it('should display "Deal ticket size" and all 6 sizes', () => {
      cy.visit(largeCapitalProfile)
        .get(selectors.investorRequirements.summary).click()
        .get(investorRequirements.taskList.dealTicketSize.name).should('contain', 'Deal ticket size')
        .get(investorRequirements.taskList.dealTicketSize.upTo49Million).should('contain', 'Up to £49 million')
        .get(investorRequirements.taskList.dealTicketSize.fiftyTo99Million).should('contain', '£50-99 million')
        .get(investorRequirements.taskList.dealTicketSize.oneHundredTo249Million).should('contain', '£100-249 million')
        .get(investorRequirements.taskList.dealTicketSize.twoHundredFiftyTo499Million).should('contain', '£250-499 million')
        .get(investorRequirements.taskList.dealTicketSize.fiveHundredTo999Million).should('contain', '£500-999 million')
        .get(investorRequirements.taskList.dealTicketSize.oneBillionPlus).should('contain', '£1 billion +')
    })
  })
})

const visitLargeCapitalProfileAndExpandAllSections = () => {
  cy.visit(largeCapitalProfile)
    .get(selectors.investorDetails.summary).click()
    .get(selectors.investorRequirements.summary).click()
    .get(selectors.location.summary).click()
}
