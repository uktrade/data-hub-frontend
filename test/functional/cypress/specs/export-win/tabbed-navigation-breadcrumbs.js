import urls from '../../../../../src/lib/urls'
import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'

describe('Tabbed navigation breadcrumbs', () => {
  ;[
    {
      name: 'Pending',
      Pending: null,
      url: urls.companies.exportWins.pending(),
    },
    {
      name: 'Confirmed',
      Confirmed: null,
      url: urls.companies.exportWins.confirmed(),
    },
    {
      name: 'Rejected',
      Rejected: null,
      url: urls.companies.exportWins.rejected(),
    },
  ].forEach(({ name, url }) => {
    it(`should update the breadcrumbs to "${name}"`, () => {
      cy.visit(url)
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Export wins': urls.companies.exportWins.index(),
        [name]: null,
      })
    })
  })
})
