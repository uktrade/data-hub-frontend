import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'
import Details from '@govuk-react/details'
import { NewWindowLink } from '../../../../../client/components/'

const ItemWrapper = styled('div')`
  border-bottom: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_3} 0;
`

const StyledDetails = styled(Details)`
  margin: ${SPACING.SCALE_3} 0 0 0;
`

const FieldHelp = ({
  helpSummary,
  helpText,
  footerUrl,
  footerUrlDescription,
  open,
}) => {
  return (
    <ItemWrapper>
      <StyledDetails summary={helpSummary} open={open}>
        {helpText}
        {footerUrl && (
          <>
            <br />
            <br />
            <NewWindowLink href={footerUrl}>
              {footerUrlDescription}
            </NewWindowLink>
          </>
        )}
      </StyledDetails>
    </ItemWrapper>
  )
}

FieldHelp.propTypes = {
  helpSummary: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  footerUrl: PropTypes.string,
  footerDescription: PropTypes.string,
  open: PropTypes.bool,
}

FieldHelp.defaultProps = {
  open: false,
}

export default FieldHelp
