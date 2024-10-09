import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { H3 } from 'govuk-react'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import { BLUE, BORDER_COLOUR } from '../../../client/utils/colours'
import urls from '../../../lib/urls'
import { state2props } from './state'
import {
  COMPANIES_NEW_INTERACTIONS_LABEL,
  COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
  INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
  INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
  INVESTMENTS_OUTSTANDING_PROPOSITIONS_LABEL,
  MY_TASKS_DUE_DATE_APPROACHING_LABEL,
  TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL,
  TASK_AMENDED_BY_OTHERS_LABEL,
  TASK_OVERDUE_LABEL,
  TASK_COMPLETED_LABEL,
} from './constants'

const LinkList = styled('ul')({
  listStyleType: 'none',
  padding: `0 0 ${SPACING.SCALE_4}`,
  margin: `0 0 ${SPACING.SCALE_4}`,
  borderBottom: `1px solid ${BORDER_COLOUR}`,
})

const LinkListItem = styled('li')({
  marginBottom: SPACING.SCALE_2,
})

const LinkListLink = styled(Link)(({ $isActive }) => ({
  textDecoration: 'none',
  position: 'relative',
  paddingLeft: SPACING.SCALE_2,
  display: 'block',
  borderLeft: `solid 5px transparent`,
  ...($isActive
    ? {
        fontWeight: FONT_WEIGHTS.bold,
        borderColor: BLUE,
      }
    : {}),
}))

const Menu = ({ children, dataTest }) => (
  <LinkList data-test={`${dataTest} link-list`}>{children}</LinkList>
)

const MenuItem = ({ to, pathname, children }) => (
  <LinkListItem data-test="link-list-item">
    <LinkListLink to={to} $isActive={to === pathname}>
      {children}
    </LinkListLink>
  </LinkListItem>
)

export const RemindersMenu = ({
  reminderSummary,
  hasInvestmentFeatureGroup,
  hasExportFeatureGroup,
  hasExportNewInteractionReminders,
}) => {
  const location = useLocation()
  return (
    <>
      {hasInvestmentFeatureGroup && (
        <Menu dataTest="investment-menu-group">
          <H3 as="h2">Investment</H3>
          <MenuItem
            to={urls.reminders.investments.estimatedLandDate()}
            pathname={location.pathname}
          >
            {`${INVESTMENTS_ESTIMATED_LAND_DATES_LABEL} (${reminderSummary.investment.estimated_land_date})`}
          </MenuItem>
          <MenuItem
            to={urls.reminders.investments.noRecentInteraction()}
            pathname={location.pathname}
          >
            {`${INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL} (${reminderSummary.investment.no_recent_interaction})`}
          </MenuItem>
          <MenuItem
            to={urls.reminders.investments.outstandingPropositions()}
            pathname={location.pathname}
          >
            {`${INVESTMENTS_OUTSTANDING_PROPOSITIONS_LABEL} (${reminderSummary.investment.outstanding_propositions})`}
          </MenuItem>
        </Menu>
      )}
      {hasExportFeatureGroup && (
        <Menu dataTest="export-menu-group">
          <H3 as="h2">Export</H3>
          <MenuItem
            to={urls.reminders.exports.noRecentInteractions()}
            pathname={location.pathname}
          >
            {`${COMPANIES_NO_RECENT_INTERACTIONS_LABEL} (${reminderSummary.export.no_recent_interaction})`}
          </MenuItem>
          {hasExportNewInteractionReminders && (
            <MenuItem
              to={urls.reminders.exports.newInteractions()}
              pathname={location.pathname}
            >
              {`${COMPANIES_NEW_INTERACTIONS_LABEL} (${reminderSummary.export.new_interaction})`}
            </MenuItem>
          )}
        </Menu>
      )}
      <H3 as="h2">My Tasks</H3>
      <Menu dataTest="my-tasks-menu-group">
        <MenuItem
          to={urls.reminders.myTasks.dueDateApproaching()}
          pathname={location.pathname}
        >
          {`${MY_TASKS_DUE_DATE_APPROACHING_LABEL} (${reminderSummary.my_tasks.due_date_approaching})`}
        </MenuItem>
        <MenuItem
          to={urls.reminders.myTasks.taskAssignedToMeFromOthers()}
          pathname={location.pathname}
        >
          {`${TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL} (${reminderSummary.my_tasks.task_assigned_to_me_from_others})`}
        </MenuItem>
        <MenuItem
          to={urls.reminders.myTasks.taskAmendedByOthers()}
          pathname={location.pathname}
        >
          {`${TASK_AMENDED_BY_OTHERS_LABEL} (${reminderSummary.my_tasks.task_amended_by_others})`}
        </MenuItem>
        <MenuItem
          to={urls.reminders.myTasks.taskOverdue()}
          pathname={location.pathname}
        >
          {`${TASK_OVERDUE_LABEL} (${reminderSummary.my_tasks.task_overdue})`}
        </MenuItem>
        <MenuItem
          to={urls.reminders.myTasks.taskCompleted()}
          pathname={location.pathname}
        >
          {`${TASK_COMPLETED_LABEL} (${reminderSummary.my_tasks.task_completed})`}
        </MenuItem>
      </Menu>
    </>
  )
}

export default connect(state2props)(RemindersMenu)
