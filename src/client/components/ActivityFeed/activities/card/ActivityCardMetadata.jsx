import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { kebabCase } from 'lodash'

import { GREY_1 } from '../../../../../client/utils/colours'

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
          <div
            key={`${label}-${index}`}
            data-test={kebabCase(`${label}-'label'`)}
          >
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
      value: PropTypes.any,
    })
  ),
}

export default ActivityCardMetadata
