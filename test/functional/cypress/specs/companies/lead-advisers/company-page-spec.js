import { assertBreadcrumbs } from '../../../support/assertions'

const fixtures = require('../../../fixtures')
const selectors = require('../../../../../selectors')
const { companies, dashboard } = require('../../../../../../src/lib/urls')

describe('Lead advisers', () => {
  context('when viewing a non One List tier company', () => {
    before(() => {
      cy.visit(companies.detail(fixtures.company.marsExportsLtd.id))
      cy.get(selectors.tabbedLocalNav().item(3)).click()
    })
    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': dashboard(),
        'Companies': companies.index(),
        [fixtures.company.marsExportsLtd.name]: companies.detail(fixtures.company.marsExportsLtd.id),
        'Lead adviser': null,
      })
    })
    it('should display the "Lead Adviser" tab in the navigation', () => {
      cy.get(selectors.tabbedLocalNav().item(3)).should('contain', 'Lead adviser')
    })
    it('should display a header with the company name', () => {
      cy.get(selectors.companyLeadAdviser.header).should('have.text', 'Lead ITA for Mars Exports Ltd')
    })
    it('should display a button to add myself as lead adviser', () => {
      cy.contains('Add myself as Lead ITA').invoke('attr', 'href').should('eq', `/companies/${fixtures.company.marsExportsLtd.id}/advisers/add`)
    })
  })
  context('when viewing a One List Tier company', () => {
    before(() => {
      cy.visit(companies.detail(fixtures.company.oneListCorp.id))
    })
    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': dashboard(),
        'Companies': companies.index(),
        [fixtures.company.oneListCorp.name]: companies.detail(fixtures.company.oneListCorp.id),
        'Activity Feed': null,
      })
    })
    it('should display the "Core team" tab in the navigation', () => {
      cy.get(selectors.tabbedLocalNav().item(3)).should('contain', 'Core team')
    })
  })
  context('when viewing a One List tier D - ITA company with an allocated Account manager', () => {
    before(() => {
      cy.visit(companies.detail(fixtures.company.oneListTierDita.id))
      cy.get(selectors.tabbedLocalNav().item(3)).click()
    })
    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': dashboard(),
        'Companies': companies.index(),
        [fixtures.company.oneListTierDita.name]: companies.detail(fixtures.company.oneListTierDita.id),
        'Lead adviser': null,
      })
    })
    it('should show the allocated Lead adviser in the company header', () => {
      cy.get(selectors.localHeader().description.paragraph(2)).should('contain', 'Lead ITA: Travis Greene')
    })
    it('should have a link to the Lead adviser tab', () => {
      cy.contains('View Lead adviser').invoke('attr', 'href').should('eq', companies.advisers.index(fixtures.company.oneListTierDita.id))
    })
    it('should display the "Lead Adviser" tab in the navigation', () => {
      cy.get(selectors.tabbedLocalNav().item(3)).should('contain', 'Lead adviser')
    })
    it('should display a header with the company name', () => {
      cy.get(selectors.companyLeadAdviser.header).should('have.text', 'Lead ITA for Ian\'s Camper Vans Ltd')
    })
    it('should display a header for the team', () => {
      cy.get(selectors.companyLeadAdviser.table.teamHeader).should('have.text', 'Team')
    })
    it('should display a header for the Lead ITA', () => {
      cy.get(selectors.companyLeadAdviser.table.leadItaHeader).should('have.text', 'Lead ITA')
    })
    it('should display a header for the Email', () => {
      cy.get(selectors.companyLeadAdviser.table.emailHeader).should('have.text', 'Email')
    })
    it('should display the team name', () => {
      cy.get(selectors.companyLeadAdviser.table.team).should('have.text', 'IST - Sector Advisory Services')
    })
    it('should display the Lead ITA', () => {
      cy.get(selectors.companyLeadAdviser.table.leadIta).should('have.text', 'Travis Greene')
    })
    it('should display the email', () => {
      cy.get(selectors.companyLeadAdviser.table.email).should('have.text', 'travis@travis.com')
    })
    it('should display a button to replace the Lead ITA', () => {
      cy.contains('Replace Lead ITA').invoke('attr', 'href').should('eq', companies.advisers.replace(fixtures.company.oneListTierDita.id))
    })
    it('should display a button to remove the Lead ITA', () => {
      cy.contains('Remove Lead ITA').invoke('attr', 'href').should('eq', companies.advisers.remove(fixtures.company.oneListTierDita.id))
    })
  })
})
