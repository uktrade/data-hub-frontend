const selectors = require('../../../../selectors')

const { assertKeyValueTable } = require('../../support/assertions')
const { companies, investments } = require('../../../../../src/lib/urls')

const today = Cypress.moment()

const createProposition = data => {
  cy.get(selectors.entityCollection.addProposition).click()
  cy.get(selectors.investment.proposition.name).type(data.name)
  cy.get(selectors.investment.proposition.scope).type(data.scope)
  cy.get(selectors.investment.proposition.day).type(data.date.format('DD'))
  cy.get(selectors.investment.proposition.month).type(data.date.format('MM'))
  cy.get(selectors.investment.proposition.year).type(data.date.format('YYYY'))
  cy.get(selectors.investment.proposition.button).click()
}

describe('Proposition', () => {
  beforeEach(() => {
    cy.visit(investments.projects.propositions('fb5b5006-56af-40e0-8615-7aba53e0e4bf'))
  })

  it('should create a proposition', () => {
    data = {
      name: 'Proposition name',
      scope: 'Proposition scope',
      date: today,
    }
    createProposition(data)

    cy.get(selectors.message.successful).should('contain', 'Proposition created')

    cy.get(selectors.collection.items)
      .should('contain', today.format('D MMMM YYYY'))
      .and('contain', data.name)
      .and('contain', 'DIT Staff')
  })

  it('should abandon a newly created proposition', () => {
    data = {
      name: 'Prospect name 1',
      scope: 'Abandon scope',
      date: today,
    }
    createProposition(data)

    cy.get(selectors.message.successful).should('contain', 'Proposition created')

    cy.get(`${selectors.collection.items}:contains("${data.name}")`)
      .find('a:contains("Abandon")').first().click()

    cy.get(selectors.investment.proposition.details).type('Not useful anymore')
    cy.get(selectors.investment.proposition.button).click()

    cy.get(selectors.message.successful).should('contain', 'Proposition abandoned')
  })
})

const populateForm = data => {
  cy.get(selectors.investment.form.name).type(data.name)
  cy.get(selectors.investment.form.description).type(data.description)
  cy.get(selectors.investment.form.primarySector).select(data.sector)
  cy.get(selectors.investment.form.businessActivity).select(data.businessActivity)
  cy.get(selectors.investment.form.clientContact).select(data.contact)
  cy.get(selectors.investment.form.clientRelationshipManagerYes).click()
  cy.get(selectors.investment.form.referralSourceYes).click()
  cy.get(selectors.investment.form.referralSourceActivity).select(data.referralSource)
  cy.get(selectors.investment.form.estimatedLandDateMonth).type(data.estimateMonth)
  cy.get(selectors.investment.form.estimatedLandDateYear).type(data.estimateYear)
  cy.get(selectors.investment.form.actualLandDateYear).type(data.year)
  cy.get(selectors.investment.form.actualLandDateMonth).type(data.month)
  cy.get(selectors.investment.form.actualLandDateDay).type(data.day)
  cy.get(selectors.investment.form.investorType).select(data.investor)
  cy.get(selectors.investment.form.levelOfInvolvement).select(data.investorLevel)
  cy.get(selectors.investment.form.specificInvestmentProgramme).select(data.investorProgramme)
  cy.contains('Save').click()
}

describe('Investment project', () => {
  const data = {
    name: 'FDI Auto Project',
    description: 'FDI Auto Description',
    sector: 'Aerospace',
    businessActivity: 'Assembly',
    contact: 'Dean Cox',
    referralSource: 'Bank',
    estimateMonth: '10',
    estimateYear: '2030',
    day: '5',
    month: '5',
    year: '2031',
    investor: 'New Investor',
    investorLevel: 'Post Only',
    investorProgramme: 'Space',
  }

  beforeEach(() => {
    cy.visit(companies.investment('0fb3379c-341c-4da4-b825-bf8d47b26baa'))
  })

  it('should create a FDI investment project', () => {
    cy.contains('Add investment project').click()
    cy.get(selectors.companyInvestmentProjects.fdiInvestmentType).click()
    cy.get(selectors.companyInvestmentProjects.fdiType).select('Merger')
    cy.get(selectors.companyInvestmentProjects.continue).click()

    cy.get(selectors.companyInvestmentProjects.sourceOfEquityYes).click()
    cy.get(selectors.companyInvestmentProjects.continue).click()

    populateForm(data)
    cy.get(selectors.message.successful).should('contain', 'Investment project created')

    assertKeyValueTable('bodyMainContent', {
      'Client': 'Lambda plc',
      'Type of investment': 'FDI, Merger',
      'Primary sector': data.sector,
      'Business activity': data.businessActivity,
      'Client contacts': data.contact,
      'Project description': data.description,
      'Estimated land date': 'October 2030',
      'Actual land date': '5 May 2031',
      'New or existing investor': data.investor,
      'Level of involvement': data.investorLevel,
      'Specific investment programme': data.investorProgramme,
    })
  })

  it('should create a FDI investment project with a different source of equity company', () => {
    cy.contains('Add investment project').click()
    cy.get(selectors.companyInvestmentProjects.fdiInvestmentType).click()
    cy.get(selectors.companyInvestmentProjects.fdiType).select('Merger')
    cy.get(selectors.companyInvestmentProjects.continue).click()

    cy.get(selectors.companyInvestmentProjects.sourceOfEquityNo).click()
    cy.get(selectors.companyInvestmentProjects.continue).click()

    cy.get(selectors.nav.searchTerm).type('Mars Exports Ltd').type('{enter}')
    cy.get('a').contains('Mars Exports Ltd').click()

    populateForm({ ...data, contact: 'Fred Peterson' })
    cy.get(selectors.message.successful).should('contain', 'Investment project created')

    assertKeyValueTable('bodyMainContent', {
      'Client': 'Mars Exports Ltd',
      'Type of investment': 'FDI, Merger',
      'Primary sector': data.sector,
      'Business activity': data.businessActivity,
      'Client contacts': 'Fred Peterson',
      'Project description': data.description,
      'Estimated land date': 'October 2030',
      'Actual land date': '5 May 2031',
      'New or existing investor': data.investor,
      'Level of involvement': data.investorLevel,
      'Specific investment programme': data.investorProgramme,
    })
  })

  it('should create a non FDI investment project', () => {
    cy.contains('Add investment project').click()
    cy.get(selectors.companyInvestmentProjects.nonFdiInvestmentType).click()
    cy.get(selectors.companyInvestmentProjects.continue).click()

    cy.get(selectors.companyInvestmentProjects.sourceOfEquityYes).click()
    cy.get(selectors.companyInvestmentProjects.continue).click()

    populateForm(data)
    cy.get(selectors.message.successful).should('contain', 'Investment project created')

    assertKeyValueTable('bodyMainContent', {
      'Client': 'Lambda plc',
      'Type of investment': 'Non-FDI',
      'Primary sector': data.sector,
      'Business activity': data.businessActivity,
      'Client contacts': data.contact,
      'Project description': data.description,
      'Estimated land date': 'October 2030',
      'Actual land date': '5 May 2031',
      'New or existing investor': data.investor,
      'Level of involvement': data.investorLevel,
      'Specific investment programme': data.investorProgramme,
    })
  })

  it('should create a commitment to investment project', () => {
    cy.contains('Add investment project').click()
    cy.get(selectors.companyInvestmentProjects.ctiInvestmentType).click()
    cy.get(selectors.companyInvestmentProjects.continue).click()

    cy.get(selectors.companyInvestmentProjects.sourceOfEquityYes).click()
    cy.get(selectors.companyInvestmentProjects.continue).click()

    populateForm(data)
    cy.get(selectors.message.successful).should('contain', 'Investment project created')

    assertKeyValueTable('bodyMainContent', {
      'Client': 'Lambda plc',
      'Type of investment': 'Commitment to invest',
      'Primary sector': data.sector,
      'Business activity': data.businessActivity,
      'Client contacts': data.contact,
      'Project description': data.description,
      'Estimated land date': 'October 2030',
      'Actual land date': '5 May 2031',
      'New or existing investor': data.investor,
      'Level of involvement': data.investorLevel,
      'Specific investment programme': data.investorProgramme,
    })
  })
})
