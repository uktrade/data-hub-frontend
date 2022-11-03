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

import { TASK_GET_ALL_REMINDER_SUBSCRIPTIONS } from '../state'

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

const RemindersSettings = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const openESL = openSettings('investments_estimated_land_date', qsParams)
  const openNRI = openSettings('investments_no_recent_interaction', qsParams)
  const openENRI = openSettings('exports_no_recent_interaction', qsParams)

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
                label="Approaching estimated land date"
                id="estimated-land-date-toggle"
                data-test="estimated-land-date-toggle"
                isOpen={openESL}
              >
                <RemindersSettingsTable
                  dataName={'estimated-land-date'}
                  data={estimatedLandDate}
                  to={urls.reminders.settings.investments.estimatedLandDate()}
                />
              </RemindersToggleSection>
              <RemindersToggleSection
                label="Projects with no recent interaction"
                id="no-recent-interaction-toggle"
                data-test="no-recent-interaction-toggle"
                isOpen={openNRI}
                borderBottom={true}
              >
                <RemindersSettingsTable
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
                        label="Companies with no recent interaction"
                        id="export-no-recent-interactions-toggle"
                        data-test="export-no-recent-interactions-toggle"
                        isOpen={openENRI}
                        borderBottom={true}
                      >
                        <RemindersSettingsTable
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
