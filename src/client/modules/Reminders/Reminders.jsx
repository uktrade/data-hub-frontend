import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'

import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'

import { state2props } from './state'

import FooterLink from './FooterLink'
import { DefaultLayout } from '../../components'
import RemindersMenu from './RemindersMenu'

import InvestmentsEstimatedLandDatesList from './InvestmentsEstimatedLandDatesList'
import InvestmentsNoRecentInteractionsList from './InvestmentsNoRecentInteractionsList'
import InvestmentsOutstandingPropositionsList from './InvestmentsOutstandingPropositionsList'
import ExportsNoRecentInteractionsList from './ExportsNoRecentInteractionsList'
import ExportsNewInteractionsList from './ExportsNewInteractionsList'
import MyTasksDueDateApproachingList from './MyTasksDueDateApproachingList'
import TaskOverdueList from './TaskOverdueList'

import urls from '../../../lib/urls'
import {
  reminderTypeToLabel,
  INVESTMENTS_ESTIMATED_LAND_DATES,
  INVESTMENTS_NO_RECENT_INTERACTIONS,
  INVESTMENTS_OUTSTANDING_PROPOSITIONS,
  COMPANIES_NO_RECENT_INTERACTIONS,
  COMPANIES_NEW_INTERACTIONS,
  MY_TASKS_DUE_DATE_APPROACHING,
  TASK_ASSIGNED_TO_ME_FROM_OTHERS,
  TASK_AMENDED_BY_OTHERS,
  TASK_OVERDUE,
  TASK_COMPLETED,
} from './constants'
import TaskAssignedToMeFromOthersList from './TaskAssignedToMeFromOthersList'
import TaskAmendedByOthersList from './TaskAmendedByOthersList'
import TaskCompletedList from './TaskCompletedList'
import AccessibleLink from '../../components/Link'

const Container = styled('div')({
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'flex',
  },
})

const MenuContainer = styled('div')({
  width: '100%',
  [MEDIA_QUERIES.DESKTOP]: {
    width: 'calc(33% - 20px)',
    padding: SPACING.SCALE_2,
  },
})

const SettingsLink = styled(AccessibleLink)({
  display: 'block',
  marginTop: SPACING.SCALE_5,
  marginBottom: SPACING.SCALE_3,
  [MEDIA_QUERIES.TABLET]: {
    display: 'none',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'none',
  },
})

const ListContainer = styled('div')({
  width: '100%',
  [MEDIA_QUERIES.DESKTOP]: {
    width: '67%',
  },
})

export const Reminders = ({ defaultUrl }) => {
  const { reminderType } = useParams()

  if (!reminderType) {
    return <Navigate to={defaultUrl} />
  }
  const subject = reminderTypeToLabel[reminderType]
  return (
    <DefaultLayout
      pageTitle={`Reminders - ${subject}`}
      heading="Reminders"
      subheading={subject}
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        { link: urls.reminders.index(), text: 'Reminders' },
        { text: subject },
      ]}
    >
      <>
        <Container>
          <MenuContainer>
            <RemindersMenu />
            {reminderType !== INVESTMENTS_OUTSTANDING_PROPOSITIONS && (
              <SettingsLink
                data-test="reminders-settings-link"
                href="/reminders/settings"
              >
                Reminders settings
              </SettingsLink>
            )}
          </MenuContainer>
          <ListContainer>
            {reminderType === INVESTMENTS_ESTIMATED_LAND_DATES && (
              <InvestmentsEstimatedLandDatesList />
            )}
            {reminderType === INVESTMENTS_NO_RECENT_INTERACTIONS && (
              <InvestmentsNoRecentInteractionsList />
            )}
            {reminderType === INVESTMENTS_OUTSTANDING_PROPOSITIONS && (
              <InvestmentsOutstandingPropositionsList />
            )}
            {reminderType === COMPANIES_NO_RECENT_INTERACTIONS && (
              <ExportsNoRecentInteractionsList />
            )}
            {reminderType === COMPANIES_NEW_INTERACTIONS && (
              <ExportsNewInteractionsList />
            )}
            {reminderType === MY_TASKS_DUE_DATE_APPROACHING && (
              <MyTasksDueDateApproachingList />
            )}
            {reminderType === TASK_ASSIGNED_TO_ME_FROM_OTHERS && (
              <TaskAssignedToMeFromOthersList />
            )}
            {reminderType === TASK_AMENDED_BY_OTHERS && (
              <TaskAmendedByOthersList />
            )}
            {reminderType === TASK_OVERDUE && <TaskOverdueList />}
            {reminderType === TASK_COMPLETED && <TaskCompletedList />}
          </ListContainer>
        </Container>
        <FooterLink
          headingText="Need Help?"
          linkUrl={urls.external.helpCentre.reminderAndSettings}
          linkText="guidance on reminders and email notifications"
        />
      </>
    </DefaultLayout>
  )
}

export default connect(state2props)(Reminders)
