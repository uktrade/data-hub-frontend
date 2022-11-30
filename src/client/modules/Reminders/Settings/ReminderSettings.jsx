import React from 'react'
import { useLocation } from 'react-router-dom'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import { get } from 'lodash'
import qs from 'qs'

import { DefaultLayout, RemindersToggleSection } from '../../../components'
import RemindersSettingsTable from './RemindersSettingsTable'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import Resource from '../../../components/Resource'
import urls from '../../../../lib/urls'

import { TASK_GET_SUBSCRIPTION_SUMMARY } from '../state'

const ToggleSectionContainer = styled('div')({
  marginTop: SPACING.SCALE_3,
  marginBottom: '40px',
})

const StyledHomeLink = styled(Link)({
  marginTop: SPACING.SCALE_5,
  marginBottom: SPACING.SCALE_5,
  display: 'block',
})

const openSettings = (queryParamType, qsParams) => {
  const settingsExpand = get(qsParams, queryParamType, false)

  return !!settingsExpand
}

const ReminderSettings = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const openESL = openSettings('investments_estimated_land_dates', qsParams)
  const openNRI = openSettings('investments_no_recent_interactions', qsParams)
  const openENRI = openSettings('companies_no_recent_interactions', qsParams)

  return (
    <DefaultLayout
      pageTitle="Settings"
      heading="Settings: reminders and email notifications"
      breadcrumbs={[
        {
          link: urls.dashboard(),
          text: 'Home',
        },
        {
          text: 'Settings: reminders and email notifications',
        },
      ]}
    >
      <Resource
        name={TASK_GET_SUBSCRIPTION_SUMMARY}
        id={TASK_GET_SUBSCRIPTION_SUMMARY}
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
                label="Approaching estimated land dates"
                id="estimated-land-dates-toggle"
                data-test="estimated-land-dates-toggle"
                isOpen={openESL}
              >
                <RemindersSettingsTable
                  dataName={'estimated-land-dates'}
                  data={estimatedLandDate}
                  to={urls.reminders.settings.investments.estimatedLandDate()}
                />
              </RemindersToggleSection>
              <RemindersToggleSection
                label="Projects with no recent interactions"
                id="no-recent-interactions-toggle"
                data-test="no-recent-interactions-toggle"
                isOpen={openNRI}
                borderBottom={true}
              >
                <RemindersSettingsTable
                  dataName={'no-recent-interactions'}
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
                        label="Companies with no recent interactions"
                        id="companies-no-recent-interactions-toggle"
                        data-test="companies-no-recent-interactions-toggle"
                        isOpen={openENRI}
                        borderBottom={true}
                      >
                        <RemindersSettingsTable
                          dataName={'companies-no-recent-interactions'}
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

export default ReminderSettings
