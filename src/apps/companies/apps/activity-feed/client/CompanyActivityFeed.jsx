import React from 'react'
import PropTypes from 'prop-types'
import { Button, Details, Paragraph, WarningText } from 'govuk-react'
import { BLACK } from 'govuk-colours'
import styled from 'styled-components'

import { ActivityFeedApp, StatusMessage } from 'data-hub-components'
import urls from '../../../../../lib/urls'

const StyledLink = styled('a')`
  margin-bottom: 0;
`

const CompanyActivityFeed = ({ companyId, showMatchingPrompt, ...rest }) => (
  <>
    {showMatchingPrompt && (
      <StatusMessage colour={BLACK}>
        <WarningText>
          Business details on this company record have not been verified and
          could be wrong.
        </WarningText>
        <Details summary="Why verify?">
          <Paragraph>
            Linking our existing records to a trusted third party means we can
            keep our information about businesses up to date automatically. It
            helps reduce duplicate records, provide a shared view of complex
            companies, and make it more likely we can link other data sources
            together.
          </Paragraph>
          <Paragraph>Linking can often be done in just four clicks.</Paragraph>
        </Details>
        <Button as={StyledLink} href={urls.companies.match.index(companyId)}>
          Verify business details
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
