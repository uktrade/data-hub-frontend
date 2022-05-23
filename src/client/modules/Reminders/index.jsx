import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import { SPACING } from '@govuk-react/constants'
import { get } from 'lodash'
import qs from 'qs'

import { DefaultLayout, RemindersToggleSection } from '../../components'
import Resource from '../../components/Resource'
import urls from '../../../lib/urls'

import { TASK_GET_REMINDER_SUBSCRIPTIONS } from './state'

const ToggleSectionContainer = styled('div')({
  marginTop: SPACING.SCALE_3,
  marginBottom: '40px',
})

const StyledTable = styled(Table)({
  marginTop: 0,
  marginLeft: SPACING.SCALE_1,
})

const StyledEditLink = styled(Link)({
  marginBottom: SPACING.SCALE_5,
  display: 'block',
})

const StyledHomeLink = styled(Link)({
  marginTop: SPACING.SCALE_5,
  display: 'block',
})

const Reminders = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const openESL = get(qsParams, 'estimated_land_date', false)
  const openNRI = get(qsParams, 'no_recent_interaction', false)
  return (
    <Resource
      name={TASK_GET_REMINDER_SUBSCRIPTIONS}
      id={TASK_GET_REMINDER_SUBSCRIPTIONS}
    >
      {({ estimatedLandDate, noRecentInteraction }) => (
        <DefaultLayout
          heading="Reminders and email notifications settings"
          pageTitle="Reminders"
        >
          <ToggleSectionContainer>
            <RemindersToggleSection
              label="Approaching estimated land date settings"
              id="estimated-land-date-toggle"
              data-test="estimated-land-date-toggle"
              isOpen={openESL}
            >
              <StyledTable data-test="estimated-land-date-table">
                <Table.Row>
                  <Table.CellHeader setWidth="33%">Reminders</Table.CellHeader>
                  <Table.Cell>{estimatedLandDate.reminderDays}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.CellHeader setWidth="33%">
                    Email notifications
                  </Table.CellHeader>
                  <Table.Cell>
                    {estimatedLandDate.emailRemindersEnabled}
                  </Table.Cell>
                </Table.Row>
              </StyledTable>
              <StyledEditLink
                data-test="estimated-land-date-link"
                href={'/'}
                aria-label="edit"
              >
                Edit
              </StyledEditLink>
            </RemindersToggleSection>
            <RemindersToggleSection
              label="No recent interaction settings"
              id="no-recent-interaction-toggle"
              data-test="no-recent-interaction-toggle"
              isOpen={openNRI}
              borderBottom={true}
            >
              <StyledTable data-test="no-recent-interaction-table">
                <Table.Row>
                  <Table.CellHeader setWidth="33%">Reminders</Table.CellHeader>
                  <Table.Cell>{noRecentInteraction.reminderDays}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.CellHeader setWidth="33%">
                    Email notifications
                  </Table.CellHeader>
                  <Table.Cell>
                    {noRecentInteraction.emailRemindersEnabled}
                  </Table.Cell>
                </Table.Row>
              </StyledTable>
              <StyledEditLink
                data-test="no-recent-interaction-link"
                href={'/'}
                aria-label="edit"
              >
                Edit
              </StyledEditLink>
            </RemindersToggleSection>
            <StyledHomeLink href={urls.dashboard()} aria-label="Home">
              Home
            </StyledHomeLink>
          </ToggleSectionContainer>
        </DefaultLayout>
      )}
    </Resource>
  )
}

export default Reminders
