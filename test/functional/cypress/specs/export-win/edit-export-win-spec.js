import { exportWinsFaker } from '../../fakers/export-wins'
import urls from '../../../../../src/lib/urls'
import { company, formFields } from './constants'

const exportWin = exportWinsFaker()

describe('Editing an export win', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api-proxy/v4/export-win/*', exportWin).as(
      'apiGetExportWin'
    )
    cy.intercept('GET', '/api-proxy/v4/metadata/team-type*', [
      {
        id: '1',
        name: 'Trade (TD or ST)',
      },
    ]).as('apiTeamType')
    cy.intercept('GET', '/api-proxy/v4/metadata/hq-team-region-or-post?*', [
      {
        id: '1',
        name: 'TD - Events - Financial & Professional Business Services',
        team_type: {
          name: 'Trade (TD or ST)',
          id: '1',
        },
      },
      {
        id: '2',
        name: 'TD - Events - Education',
        team_type: {
          name: 'Trade (TD or ST)',
          id: '1',
        },
      },
    ]).as('apiHqTeam')
  })

  context('Officer details', () => {
    it('should not render an edit status message', () => {
      cy.visit(
        urls.companies.exportWins.editOfficerDetails(company.id, exportWin.id)
      )
      cy.wait(['@apiGetExportWin', '@apiTeamType', '@apiHqTeam'])
      cy.get('[data-test="status-message"]').should('not.exist')
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
          'Contact exportwins@businessandtrade.gov.uk if you need to update the section: Export experience'
        )
    })

    it('should not render Export experience', () => {
      cy.get(formFields.customerDetails.experience).should('not.exist')
    })
  })

  context('Win details', () => {
    const { winDetails } = formFields

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
          'Contact exportwins@businessandtrade.gov.uk if you need to update the sections: ' +
            'Summary of the support you provided, Destination, Date won, Type of export win and Value'
        )
    })

    it('should not render summary of the support given', () => {
      cy.get(winDetails.description).should('not.exist')
    })

    it('should not render destination country', () => {
      cy.get(winDetails.country).should('not.exist')
    })

    it('should not render the Win date', () => {
      cy.get(winDetails.date).should('not.exist')
    })

    it('should not render the win type', () => {
      cy.get(winDetails.winType).should('not.exist')
    })

    it('should not render any breakdowns', () => {
      cy.get(winDetails.breakdownsExport).should('not.exist')
      cy.get(winDetails.breakdownsBusSucc).should('not.exist')
      cy.get(winDetails.breakdownsODI).should('not.exist')
    })
  })

  context('Support provided', () => {
    it('should not render an edit status message', () => {
      cy.visit(
        urls.companies.exportWins.editSupportProvided(company.id, exportWin.id)
      )
      cy.wait(['@apiGetExportWin'])
      cy.get('[data-test="status-message"]').should('not.exist')
    })
  })

  context('Summary', () => {
    it('should render an edit status message', () => {
      cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
      cy.wait(['@apiGetExportWin'])
      cy.get('[data-test="status-message"]').should(
        'contain',
        'To edit an export win' +
          'Edit each section that needs changing then return to the summary page. ' +
          'When you are happy with all the changes save the page.'
      )
    })

    it('should render a customer details contact link', () => {
      cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
      cy.wait(['@apiGetExportWin'])
      cy.get('[data-test="customer-details-contact"]').should(
        'have.text',
        'Contact exportwins@businessandtrade.gov.uk if you need to update the section: ' +
          'Export experience'
      )
    })

    it('should render a win details contact link', () => {
      cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
      cy.wait(['@apiGetExportWin'])
      cy.get('[data-test="win-details-contact"]').should(
        'have.text',
        'Contact exportwins@businessandtrade.gov.uk if you need to update the sections: ' +
          'Summary of the support you provided, Destination, Date won, Type of export win and Value'
      )
    })
  })

  context('Resend export win', () => {
    const getCompany = ({ agree_with_win }) => ({
      ...exportWinsFaker(),
      customer_response: {
        agree_with_win,
        expected_portion_without_help: {
          name: '40%',
        },
      },
    })

    it('should not render a "Resend export win" button when the win has been rejected', () => {
      const company = getCompany({ agree_with_win: false }) // rejected
      cy.intercept('GET', '/api-proxy/v4/export-win/*', company).as(
        'apiRejectedWin'
      )
      cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
      cy.wait('@apiRejectedWin')
      cy.get('[data-test="localHeader"]').should(
        'not.contain',
        'Resend export win'
      )
    })

    it('should not render a "Resend export win" button when the win has been won', () => {
      const company = getCompany({ agree_with_win: true }) // won
      cy.intercept('GET', '/api-proxy/v4/export-win/*', company).as('apiWonWin')
      cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
      cy.wait('@apiWonWin')
      cy.get('[data-test="localHeader"]').should(
        'not.contain',
        'Resend export win'
      )
    })

    it('should render a "Resend export win" button when the win has been sent', () => {
      const company = getCompany({ agree_with_win: null }) // sent
      cy.intercept('GET', '/api-proxy/v4/export-win/*', company).as(
        'apiSentWin'
      )
      cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
      cy.wait('@apiSentWin')
      cy.get('[data-test="resend-export-win"]').should(
        'have.text',
        'Resend export win'
      )
    })

    it('should send an export win and render a success flash message', () => {
      cy.intercept(
        'POST',
        `/api-proxy/v4/export-win/${exportWin.id}/resend-win`,
        {}
      ).as('apiResendExportWin')
      cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
      cy.wait(['@apiGetExportWin'])
      cy.get('[data-test="resend-export-win"]').click()
      cy.wait('@apiResendExportWin')
      cy.get('[data-test="flash"]').should(
        'have.text',
        `The export win ${exportWin.name_of_export} to ${exportWin.country.name} has been sent to ${exportWin.company_contacts[0].email} for review and confirmation.`
      )
    })
  })
})
