import { exportWinsFaker } from '../../fakers/export-wins'
import urls from '../../../../../src/lib/urls'
import { company, formFields } from './constants'

const exportWin = exportWinsFaker()

describe('Editing an export win', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api-proxy/v4/export-win/*', exportWin).as(
      'apiGetExportWin'
    )
    cy.intercept('GET', '/api-proxy/v4/metadata/team-type', [
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

    it('should not render any win type values', () => {
      cy.get(winDetails.winTypeValuesExport).should('not.exist')
      cy.get(winDetails.winTypeValuesBusSupp).should('not.exist')
      cy.get(winDetails.winTypeValuesODI).should('not.exist')
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

  context('Check before sending', () => {
    it('should render an edit status message', () => {
      cy.visit(urls.companies.exportWins.edit(company.id, exportWin.id))
      cy.wait(['@apiGetExportWin'])
      cy.get('[data-test="status-message"]').should(
        'contain',
        'To edit an export win' +
          'Edit each section that needs changing then return to the summary page. When you are happy with all the changes save the page.'
      )
    })
  })
})
