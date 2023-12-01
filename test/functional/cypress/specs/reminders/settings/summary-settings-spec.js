import { assertBreadcrumbs } from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'
import {
  INVESTMENTS_ESTIMATED_LAND_DATES,
  INVESTMENTS_NO_RECENT_INTERACTIONS,
  COMPANIES_NO_RECENT_INTERACTIONS,
  COMPANIES_NEW_INTERACTIONS,
  MY_TASKS_DUE_DATE_APPROACHING,
  TASK_ASSIGNED_TO_ME_FROM_OTHERS,
  TASK_AMENDED_BY_OTHERS,
  TASK_OVERDUE,
  TASK_COMPLETED,
} from '../../../../../../src/client/modules/Reminders/constants'

const summaryEndpoint = '/api-proxy/v4/reminder/subscription/summary'

const getTable = (dataTest) => `[data-test="${dataTest}-table"]`
const getLink = (dataTest) => `[data-test="${dataTest}-link"]`

const interceptAPICalls = ({
  reminder_days = [10],
  email_reminders_enabled = true,
} = {}) => {
  cy.intercept('GET', summaryEndpoint, {
    body: {
      estimated_land_date: {
        email_reminders_enabled: email_reminders_enabled,
        reminder_days: reminder_days,
      },
      no_recent_investment_interaction: {
        email_reminders_enabled: email_reminders_enabled,
        reminder_days: reminder_days,
      },
      no_recent_export_interaction: {
        email_reminders_enabled: email_reminders_enabled,
        reminder_days: reminder_days,
      },
      new_export_interaction: {
        email_reminders_enabled: email_reminders_enabled,
        reminder_days: reminder_days,
      },
      upcoming_task_reminder: {
        email_reminders_enabled: email_reminders_enabled,
        reminder_days: reminder_days,
      },
      task_assigned_to_me_from_others: {
        email_reminders_enabled: email_reminders_enabled,
      },
      task_amended_by_others: {
        email_reminders_enabled: email_reminders_enabled,
      },
      task_overdue: {
        email_reminders_enabled: email_reminders_enabled,
        reminder_days: reminder_days,
      },
      task_completed: {
        email_reminders_enabled: email_reminders_enabled,
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
    !includeLink && cy.get(getLink(dataTest)).should('not.exist')
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
      'investments_estimated_land_dates=true' +
      '&investments_no_recent_interactions=true' +
      '&companies_no_recent_interactions=true' +
      '&companies_new_interactions=true' +
      '&my_tasks_due_date_approaching=true' +
      '&task_assigned_to_me_from_others=true' +
      '&task_amended_by_others=true' +
      '&my_tasks_task_overdue=true' +
      '&my_tasks_task_completed=true'
    before(() => {
      interceptAPICalls()
      cy.visit(`${urls.reminders.settings.index()}?${queryParams}`)
      waitForAPICalls()
    })

    assertSettingsTableVisible(
      'Estimated Land Dates',
      INVESTMENTS_ESTIMATED_LAND_DATES
    )
    assertSettingsTableVisible(
      'No Recent Investment Interactions',
      INVESTMENTS_NO_RECENT_INTERACTIONS
    )
    assertSettingsTableVisible(
      'No Recent Export Interactions',
      COMPANIES_NO_RECENT_INTERACTIONS
    )
    assertSettingsTableVisible(
      'New Export Interactions',
      COMPANIES_NEW_INTERACTIONS
    )
    assertSettingsTableVisible(
      'Due Date Approaching',
      MY_TASKS_DUE_DATE_APPROACHING
    )
    assertSettingsTableVisible(
      'Task Assigned To Me From Others',
      TASK_ASSIGNED_TO_ME_FROM_OTHERS
    )
    assertSettingsTableVisible('Task Amended By Others', TASK_AMENDED_BY_OTHERS)
    assertSettingsTableVisible('Task Overdue', TASK_OVERDUE)
    assertSettingsTableVisible('Task Completed', TASK_COMPLETED)
  })
})
