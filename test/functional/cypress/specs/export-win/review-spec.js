import { assertFieldRadiosStrict } from '../../support/assertions'

import {
  COOKIE_CONSENT_COOKIE_NAME,
  GRANTED,
  DENIED,
} from '../../../../../src/client/modules/ExportWins/Review/CookiePage/tasks'

const getBannerButton = (action) => cy.contains(`${action} analytics cookies`)

const assertFlashMessage = (verb) => {
  if (verb === false) {
    cy.contains(
      'additional cookies. You can change your cookie settings at any time.'
    ).should('not.exist')
  } else {
    cy.contains(
      `You've ${verb} additional cookies. You can change your cookie settings at any time.`
    )
  }
}

const assertCookieBanner = (shouldExist) => {
  const asertion = shouldExist ? 'exist' : 'not.exist'
  cy.contains('h2', 'Cookies').should(asertion)
  cy.contains(
    'We’d like to use analytics cookies so we can understand how you use the Design System and make improvements.'
  ).should(asertion)
  cy.contains(
    'We also use essential cookies to remember if you’ve accepted analytics cookies.'
  ).should(asertion)
  getBannerButton('Accept').should(asertion)
  getBannerButton('Reject').should(asertion)
}

describe('Export wins review', () => {
  ;[
    '/exportwins/review/dummy-token',
    '/exportwins/review/thankyou',
    '/exportwins/review/accesibility-statement',
    '/exportwins/review/cookies',
  ].forEach((url) => {
    context(url, () => {
      beforeEach(() => cy.visit(url))

      it('Should not set any first party cookies', () => {
        // In fact we allow Google analytics cookies,
        // but GA is set up with a dummy ID for the test instance
        cy.getAllCookies().should('have.length', 0)
      })

      it('Should have footer with certain links', () => {
        cy.contains('a', 'Privacy Policy').should(
          'have.attr',
          'href',
          'https://www.great.gov.uk/privacy-and-cookies/full-privacy-notice/'
        )
        cy.contains('a', 'Accessibility Statement').should(
          'have.attr',
          'href',
          '/exportwins/review/accesibility-statement'
        )
        cy.contains('a', 'Cookies').should(
          'have.attr',
          'href',
          '/exportwins/review/cookies'
        )
      })

      context('Cookie consent', () => {
        context('No existing preference', () => {
          it('Should display cookie banner', () => {
            assertCookieBanner(true)
            assertFlashMessage(false)
          })
          ;[true, false].forEach((accept) =>
            it(`${accept ? 'Grant' : 'Deny'} through cookie banner`, () => {
              getBannerButton(accept ? 'Accept' : 'Reject').click()
              assertCookieBanner(false)
              assertFlashMessage(accept ? 'accepted' : 'rejected')
            })
          )
        })

        context('Existing preference', () => {
          ;[true, false].forEach((existingPreference) => {
            context(existingPreference ? 'Yes' : 'No', () => {
              it('Should not display cookie banner', () => {
                cy.visit(url, {
                  onBeforeLoad: (win) => {
                    win.localStorage.setItem(
                      COOKIE_CONSENT_COOKIE_NAME,
                      existingPreference ? GRANTED : DENIED
                    )
                  },
                })
                assertCookieBanner(false)
                assertFlashMessage(false)
              })
            })
          })
        })
      })
    })
  })

  context('Cookie page', () => {
    ;[true, false].forEach((existingPreference) => {
      context(
        `Existing preference "${existingPreference ? 'Yes' : 'No'}"`,
        () => {
          beforeEach(() =>
            cy.visit('/exportwins/review/cookies', {
              onBeforeLoad: (win) => {
                win.localStorage.setItem(
                  COOKIE_CONSENT_COOKIE_NAME,
                  existingPreference ? GRANTED : DENIED
                )
              },
            })
          )

          it(`The "${existingPreference ? 'Yes' : 'No'}" radio should be checked`, () => {
            assertCookieBanner(false)
            assertFlashMessage(false)
            assertFieldRadiosStrict({
              inputName: 'cookieConsent',
              options: ['Yes', 'No'],
              selectedIndex: existingPreference ? 0 : 1,
            })
          })
          ;[true, false].forEach((accept) => {
            it(`${accept ? 'Grant' : 'Deny'} through form`, () => {
              cy.contains('label', accept ? 'Yes' : 'No').click()
              cy.contains('button', 'Save cookie settings').click()

              assertCookieBanner(false)
              assertFlashMessage(accept ? 'accepted' : 'rejected')

              assertFieldRadiosStrict({
                inputName: 'cookieConsent',
                options: ['Yes', 'No'],
                selectedIndex: accept ? 0 : 1,
              })
            })
          })
        }
      )

      context('No existing preferrence', () => {
        beforeEach(() => cy.visit('/exportwins/review/cookies'))
        ;[true, false].forEach((accept) => {
          it(`${accept ? 'Grant' : 'Deny'} through cookie banner`, () => {
            assertCookieBanner(true)
            assertFlashMessage(false)

            getBannerButton(accept ? 'Accept' : 'Reject').click()

            assertCookieBanner(false)
            assertFlashMessage(accept ? 'accepted' : 'rejected')

            assertFieldRadiosStrict({
              inputName: 'cookieConsent',
              options: ['Yes', 'No'],
              selectedIndex: accept ? 0 : 1,
            })
          })
        })
      })
    })
  })
})
