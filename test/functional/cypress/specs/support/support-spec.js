const { expect } = require('chai')
const urls = require('../../../../../src/lib/urls')

const selectors = require('../../../../selectors')

describe('Accessing support form', () => {
  context('when visiting the support form without authorisation', () => {
    it('should require to sign in', () => {
      cy.request({
        url: urls.support(),
        followRedirect: false,
        headers: {
          // skips the ssoBypass middleware functionality, so the request will not be authorised
          'Bypass-Token': true,
        },
      }).then((response) => {
        expect(response.status).to.eq(302)
        expect(response.redirectedToUrl).to.contain('/oauth')
      })
    })
  })

  context('when visiting the support form', () => {
    it('should show a form when signed up', () => {
      cy.visit(urls.support())
      cy.get(selectors.supportForm.header).should(
        'contain',
        'Report a problem or leave feedback'
      )
    })
  })
})
