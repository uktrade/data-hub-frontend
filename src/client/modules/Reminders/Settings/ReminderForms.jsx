import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout } from '../../../components'
import urls from '../../../../lib/urls'
import { snakeCase } from 'lodash'
import {
  reminderTypeToLabel,
  INVESTMENTS_ESTIMATED_LAND_DATES,
  INVESTMENTS_NO_RECENT_INTERACTIONS,
  COMPANIES_NO_RECENT_INTERACTIONS,
} from '../constants'

import InvestmentEstimatedLandDateForm from './InvestmentEstimatedLandDateForm'
import InvestmentNoRecentInteractionForm from './InvestmentNoRecentInteractionForm'
import ExportNoRecentInteractionForm from './ExportNoRecentInteractionForm'

const ReminderForms = () => {
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
          link: urls.dashboard(),
          text: 'Home',
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
          <InvestmentEstimatedLandDateForm />
        )}
        {reminderType === INVESTMENTS_NO_RECENT_INTERACTIONS && (
          <InvestmentNoRecentInteractionForm />
        )}
        {reminderType === COMPANIES_NO_RECENT_INTERACTIONS && (
          <ExportNoRecentInteractionForm />
        )}
      </>
    </DefaultLayout>
  )
}

export default ReminderForms
