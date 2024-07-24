import { assertFieldRadiosStrict } from '../../support/assertions'

import {
  COOKIE_CONSENT_COOKIE_NAME,
  GRANTED,
  DENIED,
} from '../../../../../src/client/modules/ExportWins/Review/CookiePage/tasks'

const getBannerButton = (action) => cy.contains(`${action} analytics cookies`)

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

const assertFlashMessage = (verb) =>
  cy.contains(
    `Yo've ${verb} additional cookies. You can change your cookie settings at any time.`
  )

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
    })
  })

  context('Cookie page', () => {
    const test = ({ accept, how, action }) =>
      it(`${accept ? 'Grant' : 'Deny'} through ${how}`, () => {
        action()

        assertCookieBanner(false)
        assertFlashMessage(accept ? 'accepted' : 'rejected')
        assertFieldRadiosStrict({
          inputName: 'cookieConsent',
          options: ['Yes', 'No'],
          selectedIndex: accept ? 0 : 1,
        })
      })

    ;[true, false].forEach((existingPreference) =>
      it(`Should not show cookie banner if existing preference was "${existingPreference}"`, () => {
        cy.visit('/exportwins/review/cookies', {
          onBeforeLoad: (win) => {
            win.localStorage.setItem(
              COOKIE_CONSENT_COOKIE_NAME,
              existingPreference ? GRANTED : DENIED
            )
          },
        })
        assertCookieBanner(false)
        assertFieldRadiosStrict({
          inputName: 'cookieConsent',
          options: ['Yes', 'No'],
          selectedIndex: existingPreference ? 0 : 1,
        })
      })
    )
    ;[
      {
        existingPreference: false,
        accept: true,
        how: 'form',
        action: () => {
          cy.contains('label', 'Yes').click()
          cy.contains('button', 'Save cookie settings').click()
        },
      },
      {
        existingPreference: true,
        accept: false,
        how: 'form',
        action: () => {
          cy.contains('label', 'No').click()
          cy.contains('button', 'Save cookie settings').click()
        },
      },
    ].forEach(({ existingPreference, ...rest }) => {
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

          it(`Should not show cookie banner if existing preference was "${existingPreference}"`, () => {
            assertCookieBanner(false)
            assertFieldRadiosStrict({
              inputName: 'cookieConsent',
              options: ['Yes', 'No'],
              selectedIndex: existingPreference ? 0 : 1,
            })
          })
          test(rest)
        }
      )
    })

    context('No existing preference', () => {
      beforeEach(() => cy.visit('/exportwins/review/cookies'))

      it('Displays banner and form with no selected prefference', () => {
        assertCookieBanner(true)
        assertFieldRadiosStrict({
          inputName: 'cookieConsent',
          options: ['Yes', 'No'],
          selectedIndex: null,
        })
      })
      ;[
        {
          accept: true,
          how: 'banner',
          action: () => getBannerButton('Accept').click(),
        },
        {
          accept: false,
          how: 'banner',
          action: () => getBannerButton('Reject').click(),
        },
        {
          accept: true,
          how: 'form',
          action: () => {
            cy.contains('label', 'Yes').click()
            cy.contains('button', 'Save cookie settings').click()
          },
        },
        {
          accept: false,
          how: 'form',
          action: () => {
            cy.contains('label', 'No').click()
            cy.contains('button', 'Save cookie settings').click()
          },
        },
      ].forEach(test)
    })
  })
})
