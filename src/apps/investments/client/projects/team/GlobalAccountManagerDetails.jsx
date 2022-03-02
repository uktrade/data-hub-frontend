import React from 'react'
import { Details, Link, Paragraph, VisuallyHidden } from 'govuk-react'
import { FONT_WEIGHTS } from '@govuk-react/constants'
import styled from 'styled-components'

import urls from '../../../../../lib/urls'
import { NewWindowLink } from '../../../../../client/components'
import PropTypes from 'prop-types'

const StyledLegend = styled('legend')`
  font-weight: ${FONT_WEIGHTS.bold};
  margin-bottom: 10px;
`

const GlobalAccountManagerDetails = ({
  oneListEmail,
  globalAccountManager,
}) => (
  <>
    <StyledLegend>Global Account Manager</StyledLegend>
    <Paragraph>
      {globalAccountManager?.name ? globalAccountManager?.name : 'Not set'}
    </Paragraph>
    <Details
      summary="Need to edit the Global Account Manager information?"
      data-test="global-account-manager-links"
    >
      If you need to change the Global Account Manager for this company, go to
      the{' '}
      <NewWindowLink
        href={urls.external.digitalWorkspace.accountManagement}
        aria-label="Digital Workspace"
        showHelpText={false}
      >
        Digital Workspace
      </NewWindowLink>
      {' or '}
      {oneListEmail && (
        <>
          <Link href={`mailto:${oneListEmail}`}>
            <VisuallyHidden>opens email client for </VisuallyHidden>
            {oneListEmail}
          </Link>
          {'.'}
        </>
      )}
    </Details>
  </>
)

GlobalAccountManagerDetails.propTypes = {
  oneListEmail: PropTypes.string.isRequired,
  globalAccountManager: PropTypes.shape({
    name: PropTypes.string,
  }),
}

export { GlobalAccountManagerDetails }
