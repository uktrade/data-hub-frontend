import React from 'react'
import { useParams } from 'react-router-dom'
import { snakeCase } from 'lodash'

import { DefaultLayout } from '../../../components'
import urls from '../../../../lib/urls'
import {
  reminderTypeToLabel,
  INVESTMENTS_ESTIMATED_LAND_DATES,
  INVESTMENTS_NO_RECENT_INTERACTIONS,
  COMPANIES_NO_RECENT_INTERACTIONS,
  COMPANIES_NEW_INTERACTIONS,
  MY_TASKS_DUE_DATE_APPROACHING,
  TASK_ASSIGNED_TO_ME_FROM_OTHERS,
} from '../constants'

import InvestmentsEstimatedLandDatesForm from './InvestmentsEstimatedLandDatesForm'
import InvestmentsNoRecentInteractionsForm from './InvestmentsNoRecentInteractionsForm'
import ExportsNoRecentInteractionsForm from './ExportsNoRecentInteractionsForm'
import ExportsNewInteractionsForm from './ExportsNewInteractionsForm'
import FooterLink from '../FooterLink'
import DueDateApproachingForm from './DueDateApproachingForm'
import TaskAssignedToMeFromOthersForm from './TaskAssignedToMeFromOthersForm'

const RemindersForms = () => {
  const { reminderType } = useParams()
  const subject = reminderTypeToLabel[reminderType]
  const queryParams = `${snakeCase(reminderType)}=true`

  return (
    <DefaultLayout
      pageTitle={`Settings - ${subject}`}
      heading="Settings"
      subheading={subject}
      breadcrumbs={[
        {
          link: urls.dashboard.index(),
          text: 'Home',
        },
        {
          link: `${urls.reminders.index()}/${reminderType}`,
          text: 'Reminders',
        },
        {
          link: `${urls.reminders.settings.index()}?${queryParams}`,
          text: 'Settings',
        },
        {
          text: subject,
        },
      ]}
    >
      <>
        {reminderType === INVESTMENTS_ESTIMATED_LAND_DATES && (
          <InvestmentsEstimatedLandDatesForm />
        )}
        {reminderType === INVESTMENTS_NO_RECENT_INTERACTIONS && (
          <InvestmentsNoRecentInteractionsForm />
        )}
        {reminderType === COMPANIES_NO_RECENT_INTERACTIONS && (
          <ExportsNoRecentInteractionsForm />
        )}
        {reminderType === COMPANIES_NEW_INTERACTIONS && (
          <ExportsNewInteractionsForm />
        )}
        {reminderType === MY_TASKS_DUE_DATE_APPROACHING && (
          <DueDateApproachingForm />
        )}
        {reminderType === TASK_ASSIGNED_TO_ME_FROM_OTHERS && (
          <TaskAssignedToMeFromOthersForm />
        )}
      </>
      <FooterLink
        headingText="Need Help?"
        linkUrl={urls.external.reminderAndSettings}
        linkText="guidance on reminders and email notifications"
      />
    </DefaultLayout>
  )
}

export default RemindersForms
