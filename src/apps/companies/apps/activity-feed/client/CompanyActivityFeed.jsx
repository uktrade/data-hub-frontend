import React from 'react'
import PropTypes from 'prop-types'
import { Button, Details, Paragraph, WarningText } from 'govuk-react'
import { BLACK } from 'govuk-colours'
import styled from 'styled-components'
import { ActivityFeedAction, StatusMessage } from 'data-hub-components'

import ActivityFeedApp from './ActivityFeedApp'
import { companies } from '../../../../../lib/urls'

const StyledLink = styled('a')`
  margin-bottom: 0;
`

const CompanyActivityFeed = ({
  companyId,
  showMatchingPrompt,
  activityTypeFilter,
  activityTypeFilters,
  isGlobalUltimate,
  dnbHierarchyCount,
  isTypeFilterFlagEnabled,
  isGlobalUltimateFlagEnabled,
  apiEndpoint,
}) => {
  const actions = (
    <>
      <ActivityFeedAction
        text="Refer this company"
        link={companies.referrals.send(companyId)}
      />
      <ActivityFeedAction
        text="Add interaction"
        link={companies.interactions.create(companyId)}
      />
    </>
  )

  return (
    <>
      {showMatchingPrompt && (
        <StatusMessage colour={BLACK} id="ga-company-details-matching-prompt">
          <WarningText>
            Business details on this company record have not been verified and
            could be wrong.
          </WarningText>
          <Details summary="Why verify?">
            <Paragraph>
              Using verified business details from a trusted third-party
              supplier means we can keep certain information up to date
              automatically. This helps reduce duplicate records, provide a
              shared view of complex companies and make it more likely we can
              link other data sources together.
            </Paragraph>
            <Paragraph>
              Verification can often be done in just 4 clicks.
            </Paragraph>
          </Details>
          <Button as={StyledLink} href={companies.match.index(companyId)}>
            Verify business details
          </Button>
        </StatusMessage>
      )}
      <ActivityFeedApp
        actions={companyId && actions}
        activityTypeFilter={activityTypeFilter}
        activityTypeFilters={activityTypeFilters}
        isGlobalUltimate={isGlobalUltimate}
        dnbHierarchyCount={dnbHierarchyCount}
        isTypeFilterFlagEnabled={isTypeFilterFlagEnabled}
        isGlobalUltimateFlagEnabled={isGlobalUltimateFlagEnabled}
        apiEndpoint={apiEndpoint}
      />
    </>
  )
}

CompanyActivityFeed.propTypes = {
  companyId: PropTypes.string,
  actions: PropTypes.node,
  activityTypeFilter: PropTypes.string,
  activityTypeFilters: PropTypes.object,
  apiEndpoint: PropTypes.string.isRequired,
  isGlobalUltimate: PropTypes.bool,
  dnbHierarchyCount: PropTypes.number,
  isTypeFilterFlagEnabled: PropTypes.bool,
  isGlobalUltimateFlagEnabled: PropTypes.bool,
  showMatchingPrompt: PropTypes.bool,
}

CompanyActivityFeed.defaultProps = {
  companyId: null,
  activityTypeFilter: null,
  activityTypeFilters: {},
  actions: null,
  isGlobalUltimate: false,
  dnbHierarchyCount: null,
  isTypeFilterFlagEnabled: false,
  isGlobalUltimateFlagEnabled: false,
  showMatchingPrompt: false,
}

export default CompanyActivityFeed
