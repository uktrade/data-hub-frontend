import React from 'react'

import Contact from '../../../../../src/client/modules/ExportWins/Status/Contact'

describe('Contact', () => {
  ;['John Doe', 'Andy Pipkin', 'Lou Todd'].forEach((name) => {
    it('should render a link to ${name} if company_contacts is not empty', () => {
      const id = `id-of-${name}`

      cy.mount(<Contact win={{ company_contacts: [{ name, id }] }} />)

      cy.get('a')
        .should('have.text', name)
        .and('have.attr', 'href', `/contacts/${id}/details`)
    })

    it('should render customer_name if company_contacts empty', () => {
      cy.mount(<Contact win={{ customer_name: name }} />)

      cy.get('a').should('not.exist')
      cy.contains(RegExp(`^${name}$`))
    })
  })

  it("should render 'Not set' by default", () => {
    cy.mount(<Contact win={{}} />)

    cy.get('a').should('not.exist')
    cy.contains(RegExp(`^Not set$`))
  })
})
