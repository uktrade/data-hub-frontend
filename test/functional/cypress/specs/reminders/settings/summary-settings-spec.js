import {
  assertBreadcrumbs,
  assertKeyValueTable,
} from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const userEndpoint = '/api-proxy/whoami'
const summaryEndpoint = '/api-proxy/v4/reminder/subscription/summary'

const eslDataTest = 'estimated-land-date'
const nriDataTest = 'no-recent-interaction'
const enriDataTest = 'exports-no-recent-interaction'

const getToggle = (dataTest) => `[data-test="${dataTest}-toggle"]`
const getTable = (dataTest) => `[data-test="${dataTest}-table"]`
const getLink = (dataTest) => `[data-test="${dataTest}-link"]`

const interceptAPICalls = ({
  esl_reminder_days = [30, 60],
  esl_email_reminders_enabled = true,
  nri_reminder_days = [50, 30, 70],
  nri_email_reminders_enabled = true,
  enri_reminder_days = [10, 40, 30],
  enri_email_reminders_enabled = true,
} = {}) => {
  cy.intercept('GET', userEndpoint, {
    active_features: 'export-email-reminders',
  }).as('userRequest')
  cy.intercept('GET', summaryEndpoint, {
    body: {
      estimated_land_date: {
        email_reminders_enabled: esl_email_reminders_enabled,
        reminder_days: esl_reminder_days,
      },
      no_recent_investment_interaction: {
        email_reminders_enabled: nri_email_reminders_enabled,
        reminder_days: nri_reminder_days,
      },
      no_recent_export_interaction: {
        email_reminders_enabled: enri_email_reminders_enabled,
        reminder_days: enri_reminder_days,
      },
    },
  }).as('summaryRequest')
}

const waitForAPICalls = () => {
  cy.wait('@userRequest')
  cy.wait('@summaryRequest')
}

const assertSettingsTableVisible = (title, dataTest) => {
  it(`should show the ${title} settings table and edit link`, () => {
    cy.get(getTable(dataTest)).should('be.visible')
    cy.get(getLink(dataTest)).should('be.visible')
  })
}
const assertSettingsTableNotVisible = (title, dataTest) => {
  it(`should hide the ${title} settings table and edit link`, () => {
    cy.get(getTable(dataTest)).should('not.be.visible')
    cy.get(getLink(dataTest)).should('not.be.visible')
  })
}

const assertSettingsTableToggles = ({
  title,
  dataTest,
  reminderText,
  buttonText,
}) => {
  it(`should render the ${title} settings table`, () => {
    assertKeyValueTable(`${dataTest}-table`, {
      Reminders: reminderText,
      'Email notifications': 'On',
    })
  })

  it(`should hide the ${title} settings table on toggle`, () => {
    cy.get(getToggle(dataTest))
      .find('button')
      .contains(buttonText)
      .click()
      .get(getTable(dataTest))
      .should('not.be.visible')
      .get(getLink(dataTest))
      .should('not.be.visible')
  })
}

describe('Settings: reminders and email notifications', () => {
  context('Breadcrumbs and title', () => {
    before(() => {
      interceptAPICalls()
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        'Settings: reminders and email notifications': null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        'Settings: reminders and email notifications'
      )
    })
  })

  context('When all settings are hidden', () => {
    before(() => {
      interceptAPICalls()
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    assertSettingsTableNotVisible('ELD', eslDataTest)
    assertSettingsTableNotVisible('NRI', nriDataTest)
    assertSettingsTableNotVisible('ENRI', enriDataTest)
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

      assertSettingsTableVisible('ELD', eslDataTest)
      assertSettingsTableNotVisible('NRI', nriDataTest)
      assertSettingsTableNotVisible('ENRI', enriDataTest)

      assertSettingsTableToggles({
        title: 'ELD',
        dataTest: eslDataTest,
        reminderText: '60 and 30 days before the estimated land date',
        buttonText: 'Approaching estimated land date',
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

      assertSettingsTableNotVisible('ELD', eslDataTest)
      assertSettingsTableVisible('NRI', nriDataTest)
      assertSettingsTableNotVisible('ENRI', enriDataTest)

      assertSettingsTableToggles({
        title: 'NRI',
        dataTest: nriDataTest,
        reminderText: '30, 50 and 70 days after the last interaction',
        buttonText: 'Projects with no recent interaction',
      })
    }
  )

  context('When only no recent export interaction settings are visible', () => {
    const queryParams = 'exports_no_recent_interactions=true'
    before(() => {
      interceptAPICalls()
      cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
      waitForAPICalls()
    })

    assertSettingsTableNotVisible('ELD', eslDataTest)
    assertSettingsTableNotVisible('NRI', nriDataTest)
    assertSettingsTableVisible('ENRI', enriDataTest)

    assertSettingsTableToggles({
      title: 'ENRI',
      dataTest: enriDataTest,
      reminderText: '10, 30 and 40 days after the last interaction',
      buttonText: 'Companies with no recent interaction',
    })
  })

  context('When all settings are visible', () => {
    const queryParams =
      'investments_estimated_land_date=true&investments_no_recent_interaction=true&exports_no_recent_interactions=true'
    before(() => {
      interceptAPICalls()
      cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
      waitForAPICalls()
    })

    assertSettingsTableVisible('ELD', eslDataTest)
    assertSettingsTableVisible('NRI', nriDataTest)
    assertSettingsTableVisible('ENRI', enriDataTest)
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
      assertKeyValueTable('exports-no-recent-interaction-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })
  })
})
