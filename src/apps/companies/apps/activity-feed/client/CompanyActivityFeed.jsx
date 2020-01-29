import React from 'react'
import PropTypes from 'prop-types'
import { WarningText, Button } from 'govuk-react'
import { BLACK } from 'govuk-colours'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { ActivityFeedApp, StatusMessage } from 'data-hub-components'
import urls from '../../../../../lib/urls'

const StyledLink = styled('a')`
  margin-bottom: 0;
`

const StyledExtraMessage = styled('div')`
  margin-top: ${SPACING.SCALE_3};
  margin-bottom: ${SPACING.SCALE_3};
`

const CompanyActivityFeed = ({ companyId, showMatchingPrompt, ...rest }) => (
  <>
    {showMatchingPrompt && (
      <StatusMessage colour={BLACK}>
        <WarningText>
          There might be wrong information on this company page because it
          doesn't get updated automatically.
        </WarningText>
        <StyledExtraMessage>
          You can make sure it has the right information by selecting the
          "update this record" button below.
        </StyledExtraMessage>
        <Button as={StyledLink} href={urls.companies.match.index(companyId)}>
          Update this record
        </Button>
      </StatusMessage>
    )}
    <ActivityFeedApp {...rest} />
  </>
)

CompanyActivityFeed.propTypes = {
  companyId: PropTypes.string.isRequired,
  contentLink: PropTypes.string,
  contentText: PropTypes.string,
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
  activityTypeFilter: null,
  activityTypeFilters: {},
  contentLink: null,
  contentText: null,
  isGlobalUltimate: false,
  dnbHierarchyCount: null,
  isTypeFilterFlagEnabled: false,
  isGlobalUltimateFlagEnabled: false,
  showMatchingPrompt: false,
}

export default CompanyActivityFeed
