import React from 'react'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import Table from '@govuk-react/table'
import { H2 } from '@govuk-react/heading'
import { SPACING, MEDIA_QUERIES, LEVEL_SIZE } from '@govuk-react/constants'
import { get } from 'lodash'
import qs from 'qs'

import { DefaultLayout, RemindersToggleSection } from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
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
  marginBottom: SPACING.SCALE_5,
  display: 'block',
})

// TODO: move this to RemindersToggleSelection.jsx
const ReminderTable = ({ dataName, data, to }) => {
  return (
    <>
      <StyledTable data-test={`${dataName}-table`}>
        <Table.Row>
          <StyledCellHeader>Reminders</StyledCellHeader>
          <Table.Cell>{data.formattedReminderDays}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <StyledCellHeader>Email notifications</StyledCellHeader>
          <Table.Cell>{data.emailRemindersOnOff}</Table.Cell>
        </Table.Row>
      </StyledTable>
      <StyledRouterLink
        data-test={`${dataName}-link`}
        to={to}
        aria-label="edit"
      >
        Edit
      </StyledRouterLink>
    </>
  )
}

const openSettings = (queryParamType, qsParams) => {
  const settingsExpand = get(qsParams, queryParamType, false)

  return !!settingsExpand
}

const RemindersSettings = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const openESL = openSettings('investments_estimated_land_date', qsParams)
  const openNRI = openSettings('investments_no_recent_interaction', qsParams)
  const openENRI = openSettings('exports_no_recent_interactions', qsParams)

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
        {({
          estimatedLandDate,
          noRecentInteraction,
          exportNoRecentInteractions,
        }) => (
          <>
            <H2 size={LEVEL_SIZE[3]}>Investment</H2>
            <ToggleSectionContainer>
              <RemindersToggleSection
                label="Approaching estimated land date settings"
                id="estimated-land-date-toggle"
                data-test="estimated-land-date-toggle"
                isOpen={openESL}
              >
                <ReminderTable
                  dataName={'estimated-land-date'}
                  data={estimatedLandDate}
                  to={urls.reminders.settings.investments.estimatedLandDate()}
                />
              </RemindersToggleSection>
              <RemindersToggleSection
                label="Projects with no recent interaction settings"
                id="no-recent-interaction-toggle"
                data-test="no-recent-interaction-toggle"
                isOpen={openNRI}
                borderBottom={true}
              >
                <ReminderTable
                  dataName={'no-recent-interaction'}
                  data={noRecentInteraction}
                  to={urls.reminders.settings.investments.noRecentInteraction()}
                />
              </RemindersToggleSection>
            </ToggleSectionContainer>
            <CheckUserFeatureFlag userFeatureFlagName="export-email-reminders">
              {(isFeatureFlagEnabled) =>
                isFeatureFlagEnabled && (
                  <>
                    <H2 size={LEVEL_SIZE[3]}>Export</H2>
                    <ToggleSectionContainer>
                      <RemindersToggleSection
                        label="Companies with no recent interaction settings"
                        id="export-no-recent-interactions-toggle"
                        data-test="export-no-recent-interactions-toggle"
                        isOpen={openENRI}
                        borderBottom={true}
                      >
                        <ReminderTable
                          dataName={'export-no-recent-interactions'}
                          data={exportNoRecentInteractions}
                          to={urls.reminders.settings.exports.noRecentInteraction()}
                        />
                      </RemindersToggleSection>
                    </ToggleSectionContainer>
                  </>
                )
              }
            </CheckUserFeatureFlag>
            <StyledHomeLink href={urls.dashboard()} aria-label="Home">
              Home
            </StyledHomeLink>
          </>
        )}
      </Resource>
    </DefaultLayout>
  )
}

export default RemindersSettings
