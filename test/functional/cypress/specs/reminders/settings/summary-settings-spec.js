import { assertBreadcrumbs } from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'
import {
  INVESTMENTS_ESTIMATED_LAND_DATES,
  INVESTMENTS_NO_RECENT_INTERACTIONS,
  COMPANIES_NO_RECENT_INTERACTIONS,
  COMPANIES_NEW_INTERACTIONS,
  MY_TASKS_DUE_DATE_APPROACHING,
} from '../../../../../../src/client/modules/Reminders/constants'

const summaryEndpoint = '/api-proxy/v4/reminder/subscription/summary'

const eslDataTest = INVESTMENTS_ESTIMATED_LAND_DATES
const nriDataTest = INVESTMENTS_NO_RECENT_INTERACTIONS
const enriDataTest = COMPANIES_NO_RECENT_INTERACTIONS
const eniDataTest = COMPANIES_NEW_INTERACTIONS
const ddaDataTest = MY_TASKS_DUE_DATE_APPROACHING

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
  dda_reminder_days = [10],
  dda_email_reminders_enabled = true,
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
      upcoming_task_reminder: {
        email_reminders_enabled: dda_email_reminders_enabled,
        reminder_days: dda_reminder_days,
      },
    },
  }).as('summaryRequest')
}

const waitForAPICalls = () => {
  cy.wait('@summaryRequest')
}

const assertSettingsTableVisible = (title, dataTest, includeLink = true) => {
  it(`should show the ${title} settings table and edit link`, () => {
    cy.get(getTable(dataTest)).should('be.visible')
    includeLink && cy.get(getLink(dataTest)).should('be.visible')
  })
}

describe('Settings: reminders and email notifications', () => {
  before(() => {
    cy.setUserFeatureGroups([
      'export-notifications',
      'investment-notifications',
    ])
  })

  after(() => {
    cy.resetUser()
  })

  context('Breadcrumbs and title', () => {
    before(() => {
      interceptAPICalls()
      cy.visit(urls.reminders.settings.index())
      waitForAPICalls()
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.index(),
        Settings: null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        'Settings: reminders and email notifications'
      )
    })
  })

  context('When all settings are visible', () => {
    const queryParams =
      'investments_estimated_land_dates=true&investments_no_recent_interactions=true&companies_no_recent_interactions=true&companies_new_interactions=true&my_tasks_due_date_approaching=true'
    before(() => {
      interceptAPICalls()
      cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
      waitForAPICalls()
    })

    assertSettingsTableVisible('ELD', eslDataTest)
    assertSettingsTableVisible('NRI', nriDataTest)
    assertSettingsTableVisible('ENRI', enriDataTest)
    assertSettingsTableVisible('ENI', eniDataTest)
    assertSettingsTableVisible('DDA', ddaDataTest, false)
  })
})
