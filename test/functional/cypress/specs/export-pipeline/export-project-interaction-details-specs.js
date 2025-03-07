const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

const {
  assertBreadcrumbs,
  assertKeyValueTable,
} = require('../../support/assertions')

describe('Export project interaction details', () => {
  context('when summary tables renders with values', () => {
    const exporProjectDetails = fixtures.export.exportProjectDetails
    const exportProjectInteraction = fixtures.interaction.withoutExportCountries

    beforeEach(() => {
      cy.visit(
        `/export/${exporProjectDetails.id}/interactions/${exportProjectInteraction.id}/details`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.exportPipeline.index(),
        [exporProjectDetails.title]: urls.exportPipeline.interactions.index(
          exporProjectDetails.id
        ),
        ['Interactions']: null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]').should(
        'have.text',
        exportProjectInteraction.subject
      )
    })

    it('should display the export project interaction details summary table', () => {
      assertKeyValueTable('bodyMainContent', {
        Company: 'Venus Ltd',
        'Contact(s)': 'Theodore Schaden|6e4b048d-5bb5-4868-9455-aa712f4ceffd',
        Service: 'Export win',
        Notes: 'Not set',
        'Date of interaction': '07 October 2022',
        'Adviser(s)': 'Brendan Smith, Aberdeen City Council',
        'Communication channel': 'Letter/Fax',
        'Named trade agreement(s)': 'Not set',
        'Helped remove an export barrier': 'Yes',
      })
    })

    it('should not render the "Edit interaction" button', () => {
      cy.get('[data-test=edit-interaction]')
        .should('be.visible')
        .should('have.text', 'Edit interaction')
        .should(
          'have.attr',
          'href',
          urls.interactions.edit(exportProjectInteraction.id)
        )
    })

    it('should not render the "Back" button', () => {
      cy.get('[data-test=back]')
        .should('be.visible')
        .should('have.text', 'Back')
        .should(
          'have.attr',
          'href',
          urls.exportPipeline.interactions.index(exporProjectDetails.id)
        )
    })
  })

  context('when summary tables renders even with empty value of fields', () => {
    const exporProjectDetails = fixtures.export.exportProjectDetails
    const interactionWithEmptyValues = fixtures.interaction.withStovaEvent //minimal interaction data

    beforeEach(() => {
      cy.visit(
        `/export/${exporProjectDetails.id}/interactions/${interactionWithEmptyValues.id}/details`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.exportPipeline.index(),
        [exporProjectDetails.title]: urls.exportPipeline.interactions.index(
          exporProjectDetails.id
        ),
        ['Interactions']: null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Stova subject')
    })

    it('should render export interaction details page with "Not set" fields for empty values', () => {
      assertKeyValueTable('bodyMainContent', {
        Company: 'Not set',
        'Contact(s)': 'Johnny Cakeman',
        Service: 'Events - UK based',
        Notes: 'This is a dummy service delivery for testing',
        'Date of interaction': '05 September 2017',
        'Adviser(s)': 'Not set',
        'Communication channel': 'Not set',
        'Named trade agreement(s)': 'Not set',
        'Helped remove an export barrier': 'Not set',
      })
    })
  })
})
