import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import MetadataItem from './MetadataItem'

const StyledMetadataWrapper = styled('div')`
  font-size: ${FONT_SIZE.SIZE_16};
  line-height: ${FONT_SIZE.SIZE_27};
  display: grid;

  & > * {
    margin-bottom: ${SPACING.SCALE_1};
  }
`

const Metadata = ({ rows }) =>
  rows && (
    <StyledMetadataWrapper>
      {rows.map(({ label, value }) => (
        <MetadataItem key={label} label={label}>
          {value}
        </MetadataItem>
      ))}
    </StyledMetadataWrapper>
  )

Metadata.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.node,
    })
  ),
}

Metadata.defaultProps = {
  rows: null,
}

export default Metadata
