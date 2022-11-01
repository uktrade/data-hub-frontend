import {
  assertBreadcrumbs,
  assertKeyValueTable,
} from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const eslEndpoint = '/api-proxy/v4/reminder/subscription/estimated-land-date'
const nriEndpoint =
  '/api-proxy/v4/reminder/subscription/no-recent-investment-interaction'
const enriEndpoint =
  '/api-proxy/v4/reminder/subscription/no-recent-export-interaction'

const eslToggle = '[data-test="estimated-land-date-toggle"]'
const nriToggle = '[data-test="no-recent-interaction-toggle"]'
const enriToggle = '[data-test="export-no-recent-interactions-toggle"]'

const eslTable = '[data-test="estimated-land-date-table"]'
const nriTable = '[data-test="no-recent-interaction-table"]'
const enriTable = '[data-test="export-no-recent-interactions-table"]'

const eslLink = '[data-test="estimated-land-date-link"]'
const nriLink = '[data-test="no-recent-interaction-link"]'
const enriLink = '[data-test="export-no-recent-interactions-link"]'

const interceptAPICalls = ({
  esl_reminder_days = [30, 60],
  esl_email_reminders_enabled = true,
  nri_reminder_days = [50, 30, 70],
  nri_email_reminders_enabled = true,
  enri_reminder_days = [10, 40, 30],
  enri_email_reminders_enabled = true,
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
  cy.intercept('GET', enriEndpoint, {
    body: {
      reminder_days: enri_reminder_days,
      email_reminders_enabled: enri_email_reminders_enabled,
    },
  }).as('enriApiRequest')
}

const waitForAPICalls = () => {
  cy.wait('@eslApiRequest')
  cy.wait('@nriApiRequest')
  cy.wait('@enriApiRequest')
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

  context('When all settings are hidden', () => {
    before(() => {
      interceptAPICalls()
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    it('should hide all settings tables and edit links', () => {
      cy.get(eslTable).should('not.be.visible')
      cy.get(eslLink).should('not.be.visible')
      cy.get(nriTable).should('not.be.visible')
      cy.get(nriLink).should('not.be.visible')
      cy.get(enriTable).should('not.be.visible')
      cy.get(enriLink).should('not.be.visible')
    })
  })

  context(
    'When estimated land settings are visible and no recent interaction settings are hidden',
    () => {
      const queryParams = 'investments_estimated_land_date=true'
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

      it('should hide the ENRI settings table and edit link', () => {
        cy.get(enriTable).should('not.be.visible')
        cy.get(enriLink).should('not.be.visible')
      })

      it('should render the ELD settings table', () => {
        assertKeyValueTable('estimated-land-date-table', {
          Reminders: '60 and 30 days before the estimated land date',
          'Email notifications': 'On',
        })
      })

      it('should hide the ELD settings table on toggle', () => {
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
    'When only no recent investment interaction settings are visible',
    () => {
      const queryParams = 'investments_no_recent_interaction=true'
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

      it('should hide the ENRI settings table and edit link', () => {
        cy.get(enriTable).should('not.be.visible')
        cy.get(enriLink).should('not.be.visible')
      })

      it('should render the NRI settings table', () => {
        assertKeyValueTable('no-recent-interaction-table', {
          Reminders: '30, 50 and 70 days after the last interaction',
          'Email notifications': 'On',
        })
      })

      it('should hide the NRI settings table on toggle', () => {
        cy.get(nriToggle)
          .find('button')
          .contains('Projects with no recent interaction settings')
          .click()
          .get(nriTable)
          .should('not.be.visible')
          .get(nriLink)
          .should('not.be.visible')
      })
    }
  )

<<<<<<< HEAD
  context(
    'When both estimated land settings and no recent interaction settings are visible',
    () => {
      const queryParams =
        'investments_estimated_land_date=true&investments_no_recent_interaction=true'
      before(() => {
        interceptAPICalls()
        cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
        waitForAPICalls()
      })
=======
  context('When only no recent export interaction settings are visible', () => {
    const queryParams = 'export_no_recent_interactions=true'
    before(() => {
      interceptAPICalls()
      cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
      waitForAPICalls()
    })
>>>>>>> 2f3bd4089 (Add calls to no recent export interaction endpoint)

    it('should hide the ELD settings table and edit link', () => {
      cy.get(eslTable).should('not.be.visible')
      cy.get(eslLink).should('not.be.visible')
    })

    it('should show the NRI settings table and edit link', () => {
      cy.get(nriTable).should('not.be.visible')
      cy.get(nriLink).should('not.be.visible')
    })

    it('should hide the ENRI settings table and edit link', () => {
      cy.get(enriTable).should('be.visible')
      cy.get(enriLink).should('be.visible')
    })

    it('should render the ENRI settings table', () => {
      assertKeyValueTable('export-no-recent-interactions-table', {
        Reminders: '10, 30 and 40 days after the last interaction',
        'Email notifications': 'On',
      })
    })

    it('should hide the ENRI settings table on toggle', () => {
      cy.get(enriToggle)
        .find('button')
        .contains('Companies with no recent interaction settings')
        .click()
        .get(enriTable)
        .should('not.be.visible')
        .get(enriLink)
        .should('not.be.visible')
    })
  })

  context('When all settings are visible', () => {
    const queryParams =
      'estimated_land_date=true&no_recent_interaction=true&export_no_recent_interactions=true'
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

    it('should show the no recent export interaction settings table and edit link', () => {
      cy.get(enriTable).should('be.visible')
      cy.get(enriLink).should('be.visible')
    })
  })

  context('When no settings have been set - the default', () => {
    before(() => {
      interceptAPICalls({
        esl_reminder_days: [],
        esl_email_reminders_enabled: false,
        nri_reminder_days: [],
        nri_email_reminders_enabled: false,
        enri_reminder_days: [],
        enri_email_reminders_enabled: false,
      })
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    it('should render the ELD settings table with Off', () => {
      assertKeyValueTable('estimated-land-date-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })

    it('should render the NRI settings table with Off', () => {
      assertKeyValueTable('no-recent-interaction-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })

    it('should render the ENRI settings table with Off', () => {
      assertKeyValueTable('export-no-recent-interactions-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })
  })
})
