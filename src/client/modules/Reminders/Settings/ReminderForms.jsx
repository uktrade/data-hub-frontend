import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout } from '../../../components'
import urls from '../../../../lib/urls'
import { snakeCase } from 'lodash'
import {
  reminderTypeToLabel,
  INVESTMENTS_ESTIMATED_LAND_DATE,
  INVESTMENTS_NO_RECENT_INTERACTION,
  EXPORTS_NO_RECENT_INTERACTION,
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
        {reminderType === INVESTMENTS_ESTIMATED_LAND_DATE && (
          <InvestmentEstimatedLandDateForm />
        )}
        {reminderType === INVESTMENTS_NO_RECENT_INTERACTION && (
          <InvestmentNoRecentInteractionForm />
        )}
        {reminderType === EXPORTS_NO_RECENT_INTERACTION && (
          <ExportNoRecentInteractionForm />
        )}
      </>
    </DefaultLayout>
  )
}

export default ReminderForms
