const urls = require('../../../../../src/lib/urls')
const qs = require('qs')

/**
 * Test that the OAuth redirect url redirects to the auth server with given state
 */
const testRedirectState = (expectedStatedId) => {
  cy.request({
    url: urls.oauth.redirect(),
    followRedirect: false,
  }).then((response) => {
    expect(response.status).to.eq(302)
    const location = new URL(response.redirectedToUrl)
    const qsParams = qs.parse(location.search.slice(1))

    expect(location.pathname).to.eq('/o/authorize')
    expect(qsParams.idp).to.eq('cirrus')
    expect(qsParams.state).to.eq(expectedStatedId)
  })
}

/**
 * Test that sign out redirects to oauth signout and clears session cookie
 */
const testSignOut = () => {
  cy.request({
    url: urls.oauth.signout(),
    followRedirect: false,
  }).then((response) => {
    expect(response.status).to.eq(302)
    const location = new URL(response.redirectedToUrl)
    expect(location.pathname).to.eq('/o/logout')
    cy.getCookie('datahub.sid').should('not.exist')
  })
}

describe('Authenticating with OAuth', () => {
  beforeEach(() => {
    cy.clearCookies()
    testSignOut()
  })

  context('when using redirect oauth', () => {
    it('should set up and persist session state until logout', () => {
      cy.request({
        url: urls.oauth.redirect(),
        followRedirect: false,
      }).then((response) => {
        expect(response.status).to.eq(302)
        const location = new URL(response.redirectedToUrl)
        const { state, ...otherQsParams } = qs.parse(location.search.slice(1))

        expect(location.pathname).to.eq('/o/authorize')
        expect(otherQsParams.idp).to.eq('cirrus')

        // Next response should use the same state id
        testRedirectState(state)
      })

      cy.getCookie('datahub.sid').should('exist')
      testSignOut()
    })
  })

  context('when using callback oauth', () => {
    it('should set up and persist session state until logout', () => {
      cy.request({
        url: urls.oauth.callback(),
        followRedirect: false,
      }).then((response) => {
        expect(response.status).to.eq(302)
        const location = new URL(response.redirectedToUrl)

        expect(location.pathname).to.eq(urls.oauth.redirect())

        // Follow the redirect
        cy.request({
          url: response.redirectedToUrl,
          followRedirect: false,
        }).then((response) => {
          expect(response.status).to.eq(302)
          const location = new URL(response.redirectedToUrl)
          const { state } = qs.parse(location.search.slice(1))
          expect(location.pathname).to.eq('/o/authorize')

          // The state should persist
          testRedirectState(state)
        })
      })

      // Next response to callback url should go to dashboard page
      cy.request({
        url: urls.oauth.callback(),
        followRedirect: false,
      }).then((response) => {
        expect(response.status).to.eq(302)
        const location = new URL(response.redirectedToUrl)
        expect(location.pathname).to.eq('/')
      })

      cy.getCookie('datahub.sid').should('exist')
      testSignOut()
    })
  })
})
