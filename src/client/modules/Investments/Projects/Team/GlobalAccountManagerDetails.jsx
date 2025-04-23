import React from 'react'
import PropTypes from 'prop-types'
import { Details, Paragraph, VisuallyHidden } from 'govuk-react'
import { FONT_WEIGHTS } from '@govuk-react/constants'
import styled from 'styled-components'

import urls from '../../../../../lib/urls'
import { NewWindowLink } from '../../../../components'
import { CompanyResource } from '../../../../components/Resource'
import AccessibleLink from '../../../../components/Link'

const StyledLegend = styled('legend')`
  font-weight: ${FONT_WEIGHTS.bold};
  margin-bottom: 10px;
`

const GlobalAccountManagerDetails = ({ oneListEmail, companyId }) => (
  <CompanyResource id={companyId}>
    {(company) => (
      <>
        <StyledLegend>Global Account Manager</StyledLegend>
        <Paragraph>
          {company.oneListGroupGlobalAccountManager
            ? company.oneListGroupGlobalAccountManager?.name
            : 'Not set'}
        </Paragraph>
        <Details
          summary="Need to edit the Global Account Manager information?"
          data-test="global-account-manager-links"
        >
          If you need to change the Global Account Manager for this company, go
          to the{' '}
          <NewWindowLink href={urls.external.intranet.accountManagement}>
            Intranet
          </NewWindowLink>
          {' or '}
          {oneListEmail && (
            <>
              <AccessibleLink href={`mailto:${oneListEmail}`}>
                <VisuallyHidden>opens email client for </VisuallyHidden>
                {oneListEmail}
              </AccessibleLink>
              {'.'}
            </>
          )}
        </Details>
      </>
    )}
  </CompanyResource>
)

GlobalAccountManagerDetails.propTypes = {
  oneListEmail: PropTypes.string.isRequired,
  globalAccountManager: PropTypes.shape({
    name: PropTypes.string,
  }),
}

export default GlobalAccountManagerDetails
