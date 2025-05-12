import { exportWinsFaker } from '../../fakers/export-wins'
import urls from '../../../../../src/lib/urls'

import { company } from './constants'

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
  it('should not render a customer feedback link when the win is rejected', () => {
    cy.intercept('GET', '/api-proxy/v4/export-win/*', exportWin).as(
      'apiGetExportWin'
    )
    cy.visit(urls.companies.exportWins.editSummary(company.id, exportWin.id))
    cy.wait(['@apiGetExportWin'])
    cy.get('[data-test="customer-feedback"]').should('not.exist')
  })
})
