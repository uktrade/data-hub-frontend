import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import { first, get } from 'lodash'
import qs from 'qs'
import { connect } from 'react-redux'

import { DefaultLayout, RemindersToggleSection } from '../../../components'
import {
  RemindersSettingsTable,
  EmailRemindersSettingsTable,
} from './RemindersSettingsTable'
import Resource from '../../../components/Resource/Resource'
import urls from '../../../../lib/urls'
import { state2props, TASK_GET_SUBSCRIPTION_SUMMARY } from '../state'

import {
  INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
  INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
  COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
  COMPANIES_NEW_INTERACTIONS_LABEL,
  MY_TASKS_DUE_DATE_APPROACHING_LABEL,
  REMINDERS_SETTINGS,
  INVESTMENTS_ESTIMATED_LAND_DATES,
  INVESTMENTS_NO_RECENT_INTERACTIONS,
  MY_TASKS_DUE_DATE_APPROACHING,
  COMPANIES_NO_RECENT_INTERACTIONS,
  COMPANIES_NEW_INTERACTIONS,
  TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL,
  TASK_ASSIGNED_TO_ME_FROM_OTHERS,
  TASK_OVERDUE,
  TASK_OVERDUE_LABEL,
  TASK_COMPLETED,
  TASK_COMPLETED_LABEL,
} from '../constants'

import FooterLink from '../FooterLink'

const ToggleSectionContainer = styled('div')({
  marginTop: SPACING.SCALE_3,
  marginBottom: '40px',
})

const generateBreadcrumbs = (openSettings) => {
  const openSetting = first(openSettings)
  if (openSetting) {
    return [
      {
        link: urls.dashboard.index(),
        text: 'Home',
      },
      {
        link: openSetting.url,
        text: 'Reminders',
      },
      {
        link: urls.reminders.settings.index(),
        text: 'Settings',
      },
      {
        text: openSetting.label,
      },
    ]
  } else {
    return [
      {
        link: urls.dashboard.index(),
        text: 'Home',
      },
      {
        link: urls.reminders.index(),
        text: 'Reminders',
      },
      {
        text: 'Settings',
      },
    ]
  }
}

const isSettingOpen = (openSettingsSections, setting) =>
  openSettingsSections &&
  !!openSettingsSections.find((openSetting) => openSetting.id === setting)

const getOpenSettings = (qsParams) =>
  REMINDERS_SETTINGS.filter((x) => get(qsParams, x.settingsQSParam, false))

export const InvestmentReminderSettings = ({
  hasInvestmentFeatureGroup,
  estimatedLandDate,
  noRecentInteraction,
  openSettingsSections,
}) =>
  hasInvestmentFeatureGroup && (
    <>
      <H2 size={LEVEL_SIZE[3]}>Investment</H2>
      <ToggleSectionContainer>
        <RemindersToggleSection
          label={INVESTMENTS_ESTIMATED_LAND_DATES_LABEL}
          id={`${INVESTMENTS_ESTIMATED_LAND_DATES}-toggle`}
          data-test={`${INVESTMENTS_ESTIMATED_LAND_DATES}-toggle`}
          isOpen={isSettingOpen(
            openSettingsSections,
            INVESTMENTS_ESTIMATED_LAND_DATES
          )}
        >
          <RemindersSettingsTable
            dataName={INVESTMENTS_ESTIMATED_LAND_DATES}
            data={estimatedLandDate}
            to={urls.reminders.settings.investments.estimatedLandDate()}
          />
        </RemindersToggleSection>
        <RemindersToggleSection
          label={INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL}
          id={`${INVESTMENTS_NO_RECENT_INTERACTIONS}-toggle`}
          data-test={`${INVESTMENTS_NO_RECENT_INTERACTIONS}-toggle`}
          isOpen={isSettingOpen(
            openSettingsSections,
            INVESTMENTS_NO_RECENT_INTERACTIONS
          )}
          borderBottom={true}
        >
          <RemindersSettingsTable
            dataName={INVESTMENTS_NO_RECENT_INTERACTIONS}
            data={noRecentInteraction}
            to={urls.reminders.settings.investments.noRecentInteraction()}
          />
        </RemindersToggleSection>
      </ToggleSectionContainer>
    </>
  )

export const ExportReminderSettings = ({
  hasExportFeatureGroup,
  exportNoRecentInteractions,
  exportNewInteractions,
  openSettingsSections,
}) =>
  hasExportFeatureGroup && (
    <>
      <H2 size={LEVEL_SIZE[3]}>Export</H2>
      <ToggleSectionContainer>
        <RemindersToggleSection
          label={COMPANIES_NO_RECENT_INTERACTIONS_LABEL}
          id={`${COMPANIES_NO_RECENT_INTERACTIONS}-toggle`}
          data-test={`${COMPANIES_NO_RECENT_INTERACTIONS}-toggle`}
          isOpen={isSettingOpen(
            openSettingsSections,
            COMPANIES_NO_RECENT_INTERACTIONS
          )}
          borderBottom={true}
        >
          <RemindersSettingsTable
            dataName={COMPANIES_NO_RECENT_INTERACTIONS}
            data={exportNoRecentInteractions}
            to={urls.reminders.settings.exports.noRecentInteraction()}
          />
        </RemindersToggleSection>
        <RemindersToggleSection
          label={COMPANIES_NEW_INTERACTIONS_LABEL}
          id={`${COMPANIES_NEW_INTERACTIONS}-toggle`}
          data-test={`${COMPANIES_NEW_INTERACTIONS}-toggle`}
          isOpen={isSettingOpen(
            openSettingsSections,
            COMPANIES_NEW_INTERACTIONS
          )}
          borderBottom={true}
        >
          <RemindersSettingsTable
            dataName={COMPANIES_NEW_INTERACTIONS}
            data={exportNewInteractions}
            to={urls.reminders.settings.exports.newInteraction()}
          />
        </RemindersToggleSection>
      </ToggleSectionContainer>
    </>
  )

export const TasksAssignedToMeSettings = ({
  upcomingTaskReminder,
  taskAssignedToMeFromOthers,
  taskOverdue,
  taskCompleted,
  openSettingsSections,
}) => (
  <>
    <H2 size={LEVEL_SIZE[3]}>Tasks assigned to me</H2>
    <ToggleSectionContainer>
      <RemindersToggleSection
        label={MY_TASKS_DUE_DATE_APPROACHING_LABEL}
        id={`${MY_TASKS_DUE_DATE_APPROACHING}-toggle`}
        data-test={`${MY_TASKS_DUE_DATE_APPROACHING}-toggle`}
        isOpen={isSettingOpen(
          openSettingsSections,
          MY_TASKS_DUE_DATE_APPROACHING
        )}
        borderBottom={true}
      >
        <EmailRemindersSettingsTable
          dataName={MY_TASKS_DUE_DATE_APPROACHING}
          data={upcomingTaskReminder}
          to={urls.reminders.settings.myTasks.dueDateApproaching()}
        />
      </RemindersToggleSection>
      <RemindersToggleSection
        label={TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL}
        id={`${TASK_ASSIGNED_TO_ME_FROM_OTHERS}-toggle`}
        data-test={`${TASK_ASSIGNED_TO_ME_FROM_OTHERS}-toggle`}
        isOpen={isSettingOpen(
          openSettingsSections,
          TASK_ASSIGNED_TO_ME_FROM_OTHERS
        )}
        borderBottom={true}
      >
        <EmailRemindersSettingsTable
          dataName={TASK_ASSIGNED_TO_ME_FROM_OTHERS}
          data={taskAssignedToMeFromOthers}
          to={urls.reminders.settings.myTasks.taskAssignedToMeFromOthers()}
        />
      </RemindersToggleSection>
      <RemindersToggleSection
        label={TASK_OVERDUE_LABEL}
        id={`${TASK_OVERDUE}-toggle`}
        data-test={`${TASK_OVERDUE}-toggle`}
        isOpen={isSettingOpen(openSettingsSections, TASK_OVERDUE)}
        borderBottom={true}
      >
        <EmailRemindersSettingsTable
          dataName={TASK_OVERDUE}
          data={taskOverdue}
          to={urls.reminders.settings.myTasks.taskOverdue()}
        />
      </RemindersToggleSection>
      <RemindersToggleSection
        label={TASK_COMPLETED_LABEL}
        id={`${TASK_COMPLETED}-toggle`}
        data-test={`${TASK_COMPLETED}-toggle`}
        isOpen={isSettingOpen(openSettingsSections, TASK_COMPLETED)}
        borderBottom={false}
      >
        <EmailRemindersSettingsTable
          dataName={TASK_COMPLETED}
          data={taskCompleted}
        />
      </RemindersToggleSection>
    </ToggleSectionContainer>
  </>
)

export const RemindersSettings = ({
  hasInvestmentFeatureGroup,
  hasExportFeatureGroup,
}) => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))

  const openSettingsSections = getOpenSettings(qsParams)
  const breadcrumbs = generateBreadcrumbs(openSettingsSections)

  return (
    <DefaultLayout
      pageTitle="Settings"
      heading="Settings: reminders and email notifications"
      breadcrumbs={breadcrumbs}
    >
      <Resource
        name={TASK_GET_SUBSCRIPTION_SUMMARY}
        id={TASK_GET_SUBSCRIPTION_SUMMARY}
      >
        {({
          estimatedLandDate,
          noRecentInteraction,
          exportNoRecentInteractions,
          exportNewInteractions,
          upcomingTaskReminder,
          taskAssignedToMeFromOthers,
          taskCompleted,
          taskOverdue,
        }) => (
          <>
            <InvestmentReminderSettings
              hasInvestmentFeatureGroup={hasInvestmentFeatureGroup}
              estimatedLandDate={estimatedLandDate}
              noRecentInteraction={noRecentInteraction}
              openSettingsSections={openSettingsSections}
            />

            <ExportReminderSettings
              hasExportFeatureGroup={hasExportFeatureGroup}
              exportNoRecentInteractions={exportNoRecentInteractions}
              exportNewInteractions={exportNewInteractions}
              openSettingsSections={openSettingsSections}
            />

            <TasksAssignedToMeSettings
              upcomingTaskReminder={upcomingTaskReminder}
              taskAssignedToMeFromOthers={taskAssignedToMeFromOthers}
              taskOverdue={taskOverdue}
              taskCompleted={taskCompleted}
              openSettingsSections={openSettingsSections}
            />

            <FooterLink
              headingText="Need Help?"
              linkUrl={urls.external.reminderAndSettings}
              linkText="guidance on reminders and email notifications"
            />
          </>
        )}
      </Resource>
    </DefaultLayout>
  )
}

export default connect(state2props)(RemindersSettings)
