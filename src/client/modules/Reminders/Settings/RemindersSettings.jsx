import React from 'react'
import { useLocation } from 'react-router-dom'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import { get } from 'lodash'
import qs from 'qs'
import { connect } from 'react-redux'

import { DefaultLayout, RemindersToggleSection } from '../../../components'
import RemindersSettingsTable from './RemindersSettingsTable'
import Resource from '../../../components/Resource'
import urls from '../../../../lib/urls'
import { state2props } from '../state'

import {
  INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
  INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
  COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
  COMPANIES_NEW_INTERACTIONS_LABEL,
} from '../constants'

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

const openSettings = (queryParamType, qsParams, label, reminderReturnUrl) => {
  const settingsExpand = get(qsParams, queryParamType, false)

  return {
    isOpen: !!settingsExpand,
    breadcrumbUrl: `${urls.reminders.settings.index()}/?${queryParamType}=true`,
    breadcrumbLabel: label,
    reminderReturnUrl,
  }
}

const RemindersSettings = ({
  hasInvestmentFeatureGroup,
  hasExportFeatureGroup,
}) => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))

  let breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.reminders.index(),
      text: 'Reminders',
    },
    {
      link: urls.reminders.settings.index(),
      text: 'Settings',
    },
  ]

  const openESL = openSettings(
    'investments_estimated_land_dates',
    qsParams,
    INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
    urls.reminders.investments.estimatedLandDate()
  )
  const openNRI = openSettings(
    'investments_no_recent_interactions',
    qsParams,
    INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
    urls.reminders.investments.noRecentInteraction()
  )
  const openENRI = openSettings(
    'companies_no_recent_interactions',
    qsParams,
    COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
    urls.reminders.exports.noRecentInteractions()
  )
  const openENI = openSettings(
    'companies_new_interactions',
    qsParams,
    COMPANIES_NEW_INTERACTIONS_LABEL,
    urls.reminders.exports.newInteractions()
  )

  const openSettingsBreadCrumb = [openENI, openENRI, openESL, openNRI].find(
    (setting) => setting.isOpen
  )

  if (openSettingsBreadCrumb?.isOpen) {
    breadcrumbs.push({
      text: openSettingsBreadCrumb.breadcrumbLabel,
    })
    breadcrumbs[1].link = openSettingsBreadCrumb.reminderReturnUrl
  }

  return (
    <DefaultLayout
      pageTitle="Settings"
      heading="Settings: reminders and email notifications"
      breadcrumbs={breadcrumbs}
    >
      <Resource
        name={TASK_GET_SUBSCRIPTION_SUMMARY}
        id={TASK_GET_SUBSCRIPTION_SUMMARY}
      >
        {({
          estimatedLandDate,
          noRecentInteraction,
          exportNoRecentInteractions,
          exportNewInteractions,
        }) => (
          <>
            {hasInvestmentFeatureGroup && (
              <>
                <H2 size={LEVEL_SIZE[3]}>Investment</H2>
                <ToggleSectionContainer>
                  <RemindersToggleSection
                    label={INVESTMENTS_ESTIMATED_LAND_DATES_LABEL}
                    id="estimated-land-dates-toggle"
                    data-test="estimated-land-dates-toggle"
                    isOpen={openESL.isOpen}
                  >
                    <RemindersSettingsTable
                      dataName={'estimated-land-dates'}
                      data={estimatedLandDate}
                      to={urls.reminders.settings.investments.estimatedLandDate()}
                    />
                  </RemindersToggleSection>
                  <RemindersToggleSection
                    label={INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL}
                    id="no-recent-interactions-toggle"
                    data-test="no-recent-interactions-toggle"
                    isOpen={openNRI.isOpen}
                    borderBottom={true}
                  >
                    <RemindersSettingsTable
                      dataName={'no-recent-interactions'}
                      data={noRecentInteraction}
                      to={urls.reminders.settings.investments.noRecentInteraction()}
                    />
                  </RemindersToggleSection>
                </ToggleSectionContainer>
              </>
            )}
            {hasExportFeatureGroup && (
              <>
                <H2 size={LEVEL_SIZE[3]}>Export</H2>
                <ToggleSectionContainer>
                  <RemindersToggleSection
                    label={COMPANIES_NO_RECENT_INTERACTIONS_LABEL}
                    id="companies-no-recent-interactions-toggle"
                    data-test="companies-no-recent-interactions-toggle"
                    isOpen={openENRI.isOpen}
                    borderBottom={true}
                  >
                    <RemindersSettingsTable
                      dataName={'companies-no-recent-interactions'}
                      data={exportNoRecentInteractions}
                      to={urls.reminders.settings.exports.noRecentInteraction()}
                    />
                  </RemindersToggleSection>
                  <RemindersToggleSection
                    label={COMPANIES_NEW_INTERACTIONS_LABEL}
                    id="companies-new-interactions-toggle"
                    data-test="companies-new-interactions-toggle"
                    isOpen={openENI.isOpen}
                    borderBottom={true}
                  >
                    <RemindersSettingsTable
                      dataName={'companies-new-interactions'}
                      data={exportNewInteractions}
                      to={urls.reminders.settings.exports.newInteraction()}
                    />
                  </RemindersToggleSection>
                </ToggleSectionContainer>
              </>
            )}
            <StyledHomeLink href={urls.dashboard()} aria-label="Home">
              Home
            </StyledHomeLink>
          </>
        )}
      </Resource>
    </DefaultLayout>
  )
}

export default connect(state2props)(RemindersSettings)
