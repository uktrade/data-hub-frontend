import { exportWinsFaker } from '../../fakers/export-wins'
import urls from '../../../../../src/lib/urls'
import { company, formFields } from './constants'

const exportWin = {
  ...exportWinsFaker(),
  customer_response: {
    agree_with_win: false, // Rejected
    expected_portion_without_help: {
      name: '40%',
    },
  },
}

describe('Editing a rejected export win', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api-proxy/v4/export-win/*', exportWin).as(
      'apiGetExportWin'
    )

    cy.intercept('GET', '/api-proxy/v4/metadata/team-type*', [
      { id: '1', name: 'Trade (TD or ST)' },
    ]).as('apiTeamType')

    cy.intercept('GET', '/api-proxy/v4/metadata/hq-team-region-or-post?*', [
      {
        id: '1',
        name: 'TD - Events - Financial & Professional Business Services',
        team_type: { name: 'Trade (TD or ST)', id: '1' },
      },
      {
        id: '2',
        name: 'TD - Events - Education',
        team_type: { name: 'Trade (TD or ST)', id: '1' },
      },
    ]).as('apiHqTeam')
  })

  it('should not render a customer feedback link when the win is rejected', () => {
    cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
    cy.wait(['@apiGetExportWin'])
    cy.get('[data-test="customer-feedback"]').should('not.exist')
  })

  context('Officer details', () => {
    it('should render an edit status message', () => {
      cy.visit(
        urls.companies.exportWins.editOfficerDetails(company.id, exportWin.id)
      )
      cy.wait(['@apiGetExportWin', '@apiTeamType', '@apiHqTeam'])
      cy.get('[data-test="status-message"]').should(
        'have.text',
        'Contact exportwins@businessandtrade.gov.uk if you need to update the section: lead officer name'
      )
    })
  })

  context('Credit for this win', () => {
    it('should not render an edit status message', () => {
      cy.visit(
        urls.companies.exportWins.editCreditForThisWin(company.id, exportWin.id)
      )
      cy.wait(['@apiGetExportWin', '@apiTeamType', '@apiHqTeam'])
      cy.get('[data-test="status-message"]').should('not.exist')
    })
  })

  context('Customer details', () => {
    beforeEach(() => {
      cy.visit(
        urls.companies.exportWins.editCustomerDetails(company.id, exportWin.id)
      )
      cy.wait(['@apiGetExportWin', '@apiTeamType', '@apiHqTeam'])
    })

    it('should render an edit status message', () => {
      cy.get('[data-test="status-message"]')
        .should('exist')
        .should(
          'have.text',
          'Contact exportwins@businessandtrade.gov.uk if you need to update the section: export experience'
        )
    })

    it('should not render Export experience', () => {
      cy.get(formFields.customerDetails.experience).should('not.exist')
    })
  })

  context('Win details', () => {
    beforeEach(() => {
      cy.visit(
        urls.companies.exportWins.editWinDetails(company.id, exportWin.id)
      )
      cy.wait(['@apiGetExportWin', '@apiTeamType', '@apiHqTeam'])
    })

    it('should render an edit status message', () => {
      cy.get('[data-test="status-message"]')
        .should('exist')
        .should(
          'have.text',
          'Contact exportwins@businessandtrade.gov.uk if you need to update the sections: summary of the support given, destination country, date won, type of win and value.'
        )
    })
  })

  context('Summary', () => {
    beforeEach(() => {
      cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
      cy.wait(['@apiGetExportWin'])
    })

    it('should render support given contact link', () => {
      cy.get('[data-test="support-given-contact"]').should(
        'have.text',
        'Contact exportwins@businessandtrade.gov.uk if you need to update the section.'
      )
    })

    it('should render additional information contact link', () => {
      cy.get('[data-test="additional-info-contact"]').should(
        'have.text',
        'Contact exportwins@businessandtrade.gov.uk if you need to update the section.'
      )
    })

    it('should display What type of support was given when clicking Edit on Support given', () => {
      cy.get('[data-test="support-given"]').contains('Edit').click()

      cy.get('label').should('contain.text', 'What type of support was given?')
    })
  })
})
