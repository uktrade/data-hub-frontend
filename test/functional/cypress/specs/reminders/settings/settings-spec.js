import {
  assertBreadcrumbs,
  assertKeyValueTable,
} from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const eslEndpoint = '/api-proxy/v4/reminder/subscription/estimated-land-date'
const nriEndpoint =
  '/api-proxy/v4/reminder/subscription/no-recent-investment-interaction'

const eslToggle = '[data-test="estimated-land-date-toggle"]'
const nriToggle = '[data-test="no-recent-interaction-toggle"]'
const eslTable = '[data-test="estimated-land-date-table"]'

const eslLink = '[data-test="estimated-land-date-link"]'
const nriTable = '[data-test="no-recent-interaction-table"]'
const nriLink = '[data-test="no-recent-interaction-link"]'

const interceptAPICalls = ({
  esl_reminder_days = [30, 60],
  esl_email_reminders_enabled = true,
  nri_reminder_days = [50, 30, 70],
  nri_email_reminders_enabled = true,
} = {}) => {
  cy.intercept('GET', eslEndpoint, {
    body: {
      reminder_days: esl_reminder_days,
      email_reminders_enabled: esl_email_reminders_enabled,
    },
  }).as('eslApiRequest')
  cy.intercept('GET', nriEndpoint, {
    body: {
      reminder_days: nri_reminder_days,
      email_reminders_enabled: nri_email_reminders_enabled,
    },
  }).as('nriApiRequest')
}

const waitForAPICalls = () => {
  cy.wait('@eslApiRequest')
  cy.wait('@nriApiRequest')
}

describe('Reminders Settings', () => {
  context('Breadcrumbs and title', () => {
    before(() => {
      interceptAPICalls()
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        'Reminders and email notifications settings': null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        'Reminders and email notifications settings'
      )
    })
  })

  context(
    'When both estimated land date and no recent interaction settings are hidden',
    () => {
      before(() => {
        interceptAPICalls()
        cy.visit(urls.reminders.settings.index())
        waitForAPICalls()
      })

      it('should hide both settings tables and edit links', () => {
        cy.get(eslTable).should('not.be.visible')
        cy.get(eslLink).should('not.be.visible')
        cy.get(nriTable).should('not.be.visible')
        cy.get(nriLink).should('not.be.visible')
      })
    }
  )

  context(
    'When estimated land settings are visible and no recent interaction settings are hidden',
    () => {
      const queryParams = 'estimated_land_date=true'
      before(() => {
        interceptAPICalls()
        cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
        waitForAPICalls()
      })

      it('should show the ELD settings table and edit link', () => {
        cy.get(eslTable).should('be.visible')
        cy.get(eslLink).should('be.visible')
      })

      it('should hide the NRI settings table and edit link', () => {
        cy.get(nriTable).should('not.be.visible')
        cy.get(nriLink).should('not.be.visible')
      })

      it('should render the settings table', () => {
        assertKeyValueTable('estimated-land-date-table', {
          Reminders: '60 and 30 days before the estimated land date',
          'Email notifications': 'On',
        })
      })

      it('should hide the settings table on toggle', () => {
        cy.get(eslToggle)
          .find('button')
          .contains('Approaching estimated land date settings')
          .click()
          .get(eslTable)
          .should('not.be.visible')
          .get(eslLink)
          .should('not.be.visible')
      })
    }
  )

  context(
    'When estimated land settings are hidden and no recent interaction settings are visible',
    () => {
      const queryParams = 'no_recent_interaction=true'
      before(() => {
        interceptAPICalls()
        cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
        waitForAPICalls()
      })

      it('should hide the ELD settings table and edit link', () => {
        cy.get(eslTable).should('not.be.visible')
        cy.get(eslLink).should('not.be.visible')
      })

      it('should show the NRI settings table and edit link', () => {
        cy.get(nriTable).should('be.visible')
        cy.get(nriLink).should('be.visible')
      })

      it('should render the settings table', () => {
        assertKeyValueTable('no-recent-interaction-table', {
          Reminders: '30, 50 and 70 days after the last interaction',
          'Email notifications': 'On',
        })
      })

      it('should hide the no recent interaction settings table on toggle', () => {
        cy.get(nriToggle)
          .find('button')
          .contains('No recent interaction settings')
          .click()
          .get(eslTable)
          .should('not.be.visible')
          .get(eslLink)
          .should('not.be.visible')
      })
    }
  )

  context(
    'When both estimated land settings and no recent interaction settings are visible',
    () => {
      const queryParams = 'estimated_land_date=true&no_recent_interaction=true'
      before(() => {
        interceptAPICalls()
        cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
        waitForAPICalls()
      })

      it('should show the estimated land date settings table and edit link', () => {
        cy.get(eslTable).should('be.visible')
        cy.get(eslLink).should('be.visible')
      })

      it('should show the no recent interaction settings table and edit link', () => {
        cy.get(nriTable).should('be.visible')
        cy.get(nriLink).should('be.visible')
      })
    }
  )

  context('When no settings have been set - the default', () => {
    before(() => {
      interceptAPICalls({
        esl_reminder_days: [],
        esl_email_reminders_enabled: false,
        nri_reminder_days: [],
        nri_email_reminders_enabled: false,
      })
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    it('should render the settings table with Off', () => {
      assertKeyValueTable('estimated-land-date-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })

    it('should render the settings table', () => {
      assertKeyValueTable('no-recent-interaction-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })
  })
})
