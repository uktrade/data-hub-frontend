import {
  assertBreadcrumbs,
  assertKeyValueTable,
} from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const summaryEndpoint = '/api-proxy/v4/reminder/subscription/summary'

const eslDataTest = 'estimated-land-dates'
const nriDataTest = 'no-recent-interactions'
const enriDataTest = 'companies-no-recent-interactions'
const eniDataTest = 'companies-new-interactions'

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
  eni_reminder_days = [2, 4, 7],
  eni_email_reminders_enabled = true,
} = {}) => {
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
      new_export_interaction: {
        email_reminders_enabled: eni_email_reminders_enabled,
        reminder_days: eni_reminder_days,
      },
    },
  }).as('summaryRequest')
}

const waitForAPICalls = () => {
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
  after(() => {
    cy.resetUser()
  })

  context('Breadcrumbs and title', () => {
    before(() => {
      cy.setUserFeatureGroups([
        'export-notifications',
        'investment-notifications',
      ])
      interceptAPICalls()
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.index(),
        Settings: urls.reminders.settings.index(),
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
    assertSettingsTableNotVisible('ENI', eniDataTest)
  })

  context(
    'When estimated land settings are visible and no recent interaction settings are hidden',
    () => {
      const queryParams = 'investments_estimated_land_dates=true'
      before(() => {
        interceptAPICalls()
        cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
        waitForAPICalls()
      })

      assertSettingsTableVisible('ELD', eslDataTest)
      assertSettingsTableNotVisible('NRI', nriDataTest)
      assertSettingsTableNotVisible('ENRI', enriDataTest)
      assertSettingsTableNotVisible('ENI', eniDataTest)

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
      const queryParams = 'investments_no_recent_interactions=true'
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
    const queryParams = 'companies_no_recent_interactions=true'
    before(() => {
      interceptAPICalls()
      cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
      waitForAPICalls()
    })

    assertSettingsTableNotVisible('ELD', eslDataTest)
    assertSettingsTableNotVisible('NRI', nriDataTest)
    assertSettingsTableVisible('ENRI', enriDataTest)
    assertSettingsTableNotVisible('ENI', eniDataTest)

    assertSettingsTableToggles({
      title: 'ENRI',
      dataTest: enriDataTest,
      reminderText: '10, 30 and 40 days after the last interaction',
      buttonText: 'Companies with no recent interaction',
    })
  })

  context('When only new export interaction settings are visible', () => {
    const queryParams = 'companies_new_interactions=true'
    before(() => {
      interceptAPICalls()
      cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
      waitForAPICalls()
    })

    assertSettingsTableNotVisible('ELD', eslDataTest)
    assertSettingsTableNotVisible('NRI', nriDataTest)
    assertSettingsTableNotVisible('ENRI', enriDataTest)
    assertSettingsTableVisible('ENI', eniDataTest)

    assertSettingsTableToggles({
      title: 'ENI',
      dataTest: eniDataTest,
      reminderText: '2, 4 and 7 days after a new interaction was posted',
      buttonText: 'Companies with new interactions',
    })
  })

  context('When all settings are visible', () => {
    const queryParams =
      'investments_estimated_land_dates=true&investments_no_recent_interactions=true&companies_no_recent_interactions=true&companies_new_interactions=true'
    before(() => {
      interceptAPICalls()
      cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
      waitForAPICalls()
    })

    assertSettingsTableVisible('ELD', eslDataTest)
    assertSettingsTableVisible('NRI', nriDataTest)
    assertSettingsTableVisible('ENRI', enriDataTest)
    assertSettingsTableVisible('ENI', eniDataTest)
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
        eni_reminder_days: [],
        eni_email_reminders_enabled: false,
      })
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    it('should render the ELD settings table with Off', () => {
      assertKeyValueTable('estimated-land-dates-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })

    it('should render the NRI settings table with Off', () => {
      assertKeyValueTable('no-recent-interactions-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })

    it('should render the ENRI settings table with Off', () => {
      assertKeyValueTable('companies-no-recent-interactions-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })

    it('should render the ENI settings table with Off', () => {
      assertKeyValueTable('companies-new-interactions-table', {
        Reminders: 'Off',
        'Email notifications': 'Off',
      })
    })
  })
})
