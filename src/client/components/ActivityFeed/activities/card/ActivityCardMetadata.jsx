import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'
import { GREY_1 } from 'govuk-colours'
import styled from 'styled-components'

const StyledCardMetadata = styled('div')`
  color: ${GREY_1};
  font-size: ${FONT_SIZE.SIZE_14};
  line-height: ${FONT_SIZE.SIZE_24};
`

const ActivityCardMetadata = ({ metadata }) => (
  <StyledCardMetadata>
    {metadata.map(
      ({ label, value }, index) =>
        value && (
          <div key={`${label}-${index}`}>
            <span style={{ fontWeight: 'bold' }}>{label}:</span> {value}
          </div>
        )
    )}
  </StyledCardMetadata>
)

ActivityCardMetadata.propTypes = {
  metadata: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ),
}

export default ActivityCardMetadata
