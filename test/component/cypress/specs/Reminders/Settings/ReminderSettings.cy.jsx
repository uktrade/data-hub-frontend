import React from 'react'

import {
  InvestmentReminderSettings,
  ExportReminderSettings,
  TasksAssignedToMeSettings,
} from '../../../../../../src/client/modules/Reminders/Settings/RemindersSettings.jsx'
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
  TASK_ASSIGNED_TO_ME_FROM_OTHERS,
  TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL,
  TASK_AMENDED_BY_OTHERS,
  TASK_AMENDED_BY_OTHERS_LABEL,
  TASK_OVERDUE,
  TASK_OVERDUE_LABEL,
  TASK_COMPLETED,
  TASK_COMPLETED_LABEL,
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
  context('When feature flag is disabled', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <InvestmentReminderSettings hasInvestmentFeatureGroup={false} />
      )
    })

    it('should return an empty component', () => {
      cy.get('h2').should('not.exist')
    })
  })

  context('When feature flag is enabled', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <InvestmentReminderSettings
          hasInvestmentFeatureGroup={true}
          estimatedLandDate={{}}
          noRecentInteraction={{}}
        />
      )
    })

    it('should return all investment reminder setting sections', () => {
      cy.get(getToggle(INVESTMENTS_ESTIMATED_LAND_DATES)).should('be.visible')
      cy.get(getToggle(INVESTMENTS_NO_RECENT_INTERACTIONS)).should('be.visible')
    })
  })

  context('When estimated land dates setting is open', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <InvestmentReminderSettings
          hasInvestmentFeatureGroup={true}
          openSettingsSections={[{ id: INVESTMENTS_ESTIMATED_LAND_DATES }]}
          estimatedLandDate={setting}
          noRecentInteraction={setting}
        />
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
      cy.mountWithProvider(
        <InvestmentReminderSettings
          hasInvestmentFeatureGroup={true}
          openSettingsSections={[{ id: INVESTMENTS_NO_RECENT_INTERACTIONS }]}
          estimatedLandDate={setting}
          noRecentInteraction={setting}
        />
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
  context('When feature flag is disabled', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <ExportReminderSettings hasExportFeatureGroup={false} />
      )
    })

    it('should return an empty component', () => {
      cy.get('h2').should('not.exist')
    })
  })

  context('When feature flag is enabled', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <ExportReminderSettings
          hasExportFeatureGroup={true}
          exportNoRecentInteractions={{}}
          exportNewInteractions={{}}
        />
      )
    })

    it('should return all investment reminder setting sections', () => {
      cy.get(getToggle(COMPANIES_NO_RECENT_INTERACTIONS)).should('be.visible')
      cy.get(getToggle(COMPANIES_NEW_INTERACTIONS)).should('be.visible')
    })
  })

  context('When companies with no recent interactions setting is open', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <ExportReminderSettings
          hasExportFeatureGroup={true}
          openSettingsSections={[{ id: COMPANIES_NO_RECENT_INTERACTIONS }]}
          exportNoRecentInteractions={setting}
          exportNewInteractions={setting}
        />
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
      cy.mountWithProvider(
        <ExportReminderSettings
          hasExportFeatureGroup={true}
          openSettingsSections={[{ id: COMPANIES_NEW_INTERACTIONS }]}
          exportNoRecentInteractions={setting}
          exportNewInteractions={setting}
        />
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
  function mountComponent(id) {
    cy.mountWithProvider(
      <TasksAssignedToMeSettings
        openSettingsSections={[{ id: id }]}
        upcomingTaskReminder={setting}
        taskAssignedToMeFromOthers={setting}
        taskAmendedByOthers={setting}
        taskOverdue={setting}
        taskCompleted={setting}
      />
    )
  }

  function assertMyTasks(dataTest, label) {
    assertSettingsSectionExpanded(dataTest)
    assertEmailTableData(dataTest, setting)
    assertEditLink(dataTest)
    assertToggleSection(dataTest, label)
  }

  context('When component loads', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <TasksAssignedToMeSettings
          upcomingTaskReminder={{}}
          taskAssignedToMeFromOthers={{}}
          taskAmendedByOthers={{}}
          taskOverdue={{}}
          taskCompleted={{}}
        />
      )
    })

    it('should return all my tasks reminder setting sections', () => {
      cy.get(getToggle(MY_TASKS_DUE_DATE_APPROACHING)).should('be.visible')
      cy.get(getToggle(TASK_ASSIGNED_TO_ME_FROM_OTHERS)).should('be.visible')
      cy.get(getToggle(TASK_AMENDED_BY_OTHERS)).should('be.visible')
      cy.get(getToggle(TASK_OVERDUE)).should('be.visible')
      cy.get(getToggle(TASK_COMPLETED)).should('be.visible')
    })
  })

  context('When due date approaching setting is open', () => {
    beforeEach(() => {
      mountComponent(MY_TASKS_DUE_DATE_APPROACHING)
    })

    assertMyTasks(
      MY_TASKS_DUE_DATE_APPROACHING,
      MY_TASKS_DUE_DATE_APPROACHING_LABEL
    )
  })

  context('When task assigned to me from others setting is open', () => {
    beforeEach(() => {
      mountComponent(TASK_ASSIGNED_TO_ME_FROM_OTHERS)
    })

    assertMyTasks(
      TASK_ASSIGNED_TO_ME_FROM_OTHERS,
      TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL
    )
  })

  context('When task amended by others setting is open', () => {
    beforeEach(() => {
      mountComponent(TASK_AMENDED_BY_OTHERS)
    })

    assertMyTasks(TASK_AMENDED_BY_OTHERS, TASK_AMENDED_BY_OTHERS_LABEL)
  })

  context('When task overdue setting is open', () => {
    beforeEach(() => {
      mountComponent(TASK_OVERDUE)
    })

    assertMyTasks(TASK_OVERDUE, TASK_OVERDUE_LABEL)
  })

  context('When task completed setting is open', () => {
    beforeEach(() => {
      mountComponent(TASK_COMPLETED)
    })

    assertMyTasks(TASK_COMPLETED, TASK_COMPLETED_LABEL)
  })
})
