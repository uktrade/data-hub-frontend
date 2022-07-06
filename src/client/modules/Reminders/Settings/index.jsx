import React from 'react'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import Table from '@govuk-react/table'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import { get } from 'lodash'
import qs from 'qs'

import { DefaultLayout, RemindersToggleSection } from '../../../components'
import Resource from '../../../components/Resource'
import urls from '../../../../lib/urls'

import { TASK_GET_ALL_REMINDER_SUBSCRIPTIONS } from '../state'

const ToggleSectionContainer = styled('div')({
  marginTop: SPACING.SCALE_3,
  marginBottom: '40px',
})

const StyledTable = styled(Table)({
  marginTop: 0,
  marginLeft: SPACING.SCALE_1,
})

const StyledCellHeader = styled(Table.CellHeader)({
  [MEDIA_QUERIES.TABLET]: {
    width: '33%',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    width: '33%',
  },
})

const StyledRouterLink = styled(RouterLink)({
  marginBottom: SPACING.SCALE_5,
  display: 'block',
})

const StyledHomeLink = styled(Link)({
  marginTop: SPACING.SCALE_5,
  display: 'block',
})

const RemindersSettings = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const openESL = get(qsParams, 'estimated_land_date', false)
  const openNRI = get(qsParams, 'no_recent_interaction', false)
  return (
    <DefaultLayout
      heading="Reminders and email notifications settings"
      pageTitle="Reminders"
      breadcrumbs={[
        {
          link: urls.dashboard(),
          text: 'Home',
        },
        {
          text: 'Reminders and email notifications settings',
        },
      ]}
    >
      <Resource
        name={TASK_GET_ALL_REMINDER_SUBSCRIPTIONS}
        id={TASK_GET_ALL_REMINDER_SUBSCRIPTIONS}
      >
        {({ estimatedLandDate, noRecentInteraction }) => (
          <ToggleSectionContainer>
            <RemindersToggleSection
              label="Approaching estimated land date settings"
              id="estimated-land-date-toggle"
              data-test="estimated-land-date-toggle"
              isOpen={openESL}
            >
              <StyledTable data-test="estimated-land-date-table">
                <Table.Row>
                  <StyledCellHeader>Reminders</StyledCellHeader>
                  <Table.Cell>
                    {estimatedLandDate.formattedReminderDays}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <StyledCellHeader>Email notifications</StyledCellHeader>
                  <Table.Cell>
                    {estimatedLandDate.emailRemindersOnOff}
                  </Table.Cell>
                </Table.Row>
              </StyledTable>
              <StyledRouterLink
                data-test="estimated-land-date-link"
                to={urls.reminders.settings.estimatedLandDate()}
                aria-label="edit"
              >
                Edit
              </StyledRouterLink>
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
                  <StyledCellHeader>Reminders</StyledCellHeader>
                  <Table.Cell>
                    {noRecentInteraction.formattedReminderDays}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <StyledCellHeader>Email notifications</StyledCellHeader>
                  <Table.Cell>
                    {noRecentInteraction.emailRemindersOnOff}
                  </Table.Cell>
                </Table.Row>
              </StyledTable>
              <StyledRouterLink
                data-test="no-recent-interaction-link"
                to={urls.reminders.settings.noRecentInteraction()}
                aria-label="edit"
              >
                Edit
              </StyledRouterLink>
            </RemindersToggleSection>
            <StyledHomeLink href={urls.dashboard()} aria-label="Home">
              Home
            </StyledHomeLink>
          </ToggleSectionContainer>
        )}
      </Resource>
    </DefaultLayout>
  )
}

export default RemindersSettings
