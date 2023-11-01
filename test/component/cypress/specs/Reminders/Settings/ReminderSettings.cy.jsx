import React from 'react'

import {
  InvestmentReminderSettings,
  ExportReminderSettings,
  TasksAssignedToMeSettings,
} from '../../../../../../src/client/modules/Reminders/Settings/RemindersSettings.jsx'
import DataHubProvider from '../../provider'
import {
  COMPANIES_NEW_INTERACTIONS,
  COMPANIES_NEW_INTERACTIONS_LABEL,
  COMPANIES_NO_RECENT_INTERACTIONS,
  COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
  INVESTMENTS_ESTIMATED_LAND_DATES,
  INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
  INVESTMENTS_NO_RECENT_INTERACTIONS,
  INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
  MY_TASKS_DUE_DATE_APPROACHING,
  MY_TASKS_DUE_DATE_APPROACHING_LABEL,
} from '../../../../../../src/client/modules/Reminders/constants.js'
import { assertKeyValueTable } from '../../../../../functional/cypress/support/assertions.js'

const getToggle = (dataTest) => `[data-test="${dataTest}-toggle"]`
const getTable = (dataTest) => `[data-test="${dataTest}-table"]`
const getLink = (dataTest) => `[data-test="${dataTest}-link"]`

const setting = {
  formattedReminderDays: 'a',
  emailRemindersOnOff: 'b',
}

const assertSettingsSectionExpanded = (dataTest) => {
  it('should show the expanded settings section', () => {
    cy.get(getTable(dataTest)).should('be.visible')
  })
}

const assertReminderAndEmailTableData = (dataTest, setting) => {
  it('should show the table with expected data', () => {
    assertKeyValueTable(`${dataTest}-table`, {
      Reminders: setting.formattedReminderDays,
      'Email notifications': setting.emailRemindersOnOff,
    })
  })
}
const assertEmailTableData = (dataTest, setting) => {
  it('should show the table with expected data', () => {
    assertKeyValueTable(`${dataTest}-table`, {
      'Email notifications': setting.emailRemindersOnOff,
    })
  })
}

const assertEditLink = (dataTest) => {
  it('should show the edit link', () => {
    cy.get(getLink(dataTest)).should('be.visible')
  })
}

const assertToggleSection = (dataTest, label) => {
  it(`should hide the settings table on toggle`, () => {
    cy.get(getToggle(dataTest))
      .find('button')
      .contains(label)
      .click()
      .get(getTable(dataTest))
      .should('not.be.visible')
  })
}

describe('InvestmentReminderSettings', () => {
  const Component = (props) => <InvestmentReminderSettings {...props} />

  context('When feature flag is disabled', () => {
    beforeEach(() => {
      cy.mount(<Component hasInvestmentFeatureGroup={false} />)
    })

    it('should return an empty component', () => {
      cy.get('h2').should('not.exist')
    })
  })

  context('When feature flag is enabled', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasInvestmentFeatureGroup={true}
            estimatedLandDate={{}}
            noRecentInteraction={{}}
          />
        </DataHubProvider>
      )
    })

    it('should return all investment reminder setting sections', () => {
      cy.get(getToggle(INVESTMENTS_ESTIMATED_LAND_DATES)).should('be.visible')
      cy.get(getToggle(INVESTMENTS_NO_RECENT_INTERACTIONS)).should('be.visible')
    })
  })

  context('When estimated land dates setting is open', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasInvestmentFeatureGroup={true}
            openSettingsSections={[{ id: INVESTMENTS_ESTIMATED_LAND_DATES }]}
            estimatedLandDate={setting}
            noRecentInteraction={setting}
          />
        </DataHubProvider>
      )
    })

    assertSettingsSectionExpanded(INVESTMENTS_ESTIMATED_LAND_DATES)

    assertReminderAndEmailTableData(INVESTMENTS_ESTIMATED_LAND_DATES, setting)

    assertEditLink(INVESTMENTS_ESTIMATED_LAND_DATES)

    assertToggleSection(
      INVESTMENTS_ESTIMATED_LAND_DATES,
      INVESTMENTS_ESTIMATED_LAND_DATES_LABEL
    )
  })

  context('When no recent interactions setting is open', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasInvestmentFeatureGroup={true}
            openSettingsSections={[{ id: INVESTMENTS_NO_RECENT_INTERACTIONS }]}
            estimatedLandDate={setting}
            noRecentInteraction={setting}
          />
        </DataHubProvider>
      )
    })

    assertSettingsSectionExpanded(INVESTMENTS_NO_RECENT_INTERACTIONS)

    assertReminderAndEmailTableData(INVESTMENTS_NO_RECENT_INTERACTIONS, setting)

    assertEditLink(INVESTMENTS_NO_RECENT_INTERACTIONS)

    assertToggleSection(
      INVESTMENTS_NO_RECENT_INTERACTIONS,
      INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL
    )
  })
})

describe('ExportReminderSettings', () => {
  const Component = (props) => <ExportReminderSettings {...props} />

  context('When feature flag is disabled', () => {
    beforeEach(() => {
      cy.mount(<Component hasExportFeatureGroup={false} />)
    })

    it('should return an empty component', () => {
      cy.get('h2').should('not.exist')
    })
  })

  context('When feature flag is enabled', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasExportFeatureGroup={true}
            exportNoRecentInteractions={{}}
            exportNewInteractions={{}}
          />
        </DataHubProvider>
      )
    })

    it('should return all investment reminder setting sections', () => {
      cy.get(getToggle(COMPANIES_NO_RECENT_INTERACTIONS)).should('be.visible')
      cy.get(getToggle(COMPANIES_NEW_INTERACTIONS)).should('be.visible')
    })
  })

  context('When companies with no recent interactions setting is open', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasExportFeatureGroup={true}
            openSettingsSections={[{ id: COMPANIES_NO_RECENT_INTERACTIONS }]}
            exportNoRecentInteractions={setting}
            exportNewInteractions={setting}
          />
        </DataHubProvider>
      )
    })

    assertSettingsSectionExpanded(COMPANIES_NO_RECENT_INTERACTIONS)

    assertReminderAndEmailTableData(COMPANIES_NO_RECENT_INTERACTIONS, setting)

    assertEditLink(COMPANIES_NO_RECENT_INTERACTIONS)

    assertToggleSection(
      COMPANIES_NO_RECENT_INTERACTIONS,
      COMPANIES_NO_RECENT_INTERACTIONS_LABEL
    )
  })

  context('When companies with new interactions setting is open', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasExportFeatureGroup={true}
            openSettingsSections={[{ id: COMPANIES_NEW_INTERACTIONS }]}
            exportNoRecentInteractions={setting}
            exportNewInteractions={setting}
          />
        </DataHubProvider>
      )
    })

    assertSettingsSectionExpanded(COMPANIES_NEW_INTERACTIONS)

    assertReminderAndEmailTableData(COMPANIES_NEW_INTERACTIONS, setting)

    assertEditLink(COMPANIES_NEW_INTERACTIONS)

    assertToggleSection(
      COMPANIES_NEW_INTERACTIONS,
      COMPANIES_NEW_INTERACTIONS_LABEL
    )
  })
})

describe('TasksAssignedToMeSettings', () => {
  const Component = (props) => <TasksAssignedToMeSettings {...props} />

  context('When component loads', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component upcomingTaskReminder={{}} />
        </DataHubProvider>
      )
    })

    it('should return all my tasks reminder setting sections', () => {
      cy.get(getToggle(MY_TASKS_DUE_DATE_APPROACHING)).should('be.visible')
    })
  })

  context('When due date approaching setting is open', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            openSettingsSections={[{ id: MY_TASKS_DUE_DATE_APPROACHING }]}
            upcomingTaskReminder={setting}
          />
        </DataHubProvider>
      )
    })

    assertSettingsSectionExpanded(MY_TASKS_DUE_DATE_APPROACHING)

    assertEmailTableData(MY_TASKS_DUE_DATE_APPROACHING, setting)

    assertEditLink(MY_TASKS_DUE_DATE_APPROACHING)

    assertToggleSection(
      MY_TASKS_DUE_DATE_APPROACHING,
      MY_TASKS_DUE_DATE_APPROACHING_LABEL
    )
  })
})
