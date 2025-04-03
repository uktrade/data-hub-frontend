import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'

import MetadataItem from './MetadataItem'

const StyledMetadataWrapper = styled('div')`
  font-size: ${FONT_SIZE.SIZE_16};
  line-height: ${FONT_SIZE.SIZE_27};
  display: grid;

  & > * {
    margin-bottom: 0px;
  }
`

const Metadata = ({ rows }) =>
  rows && (
    <StyledMetadataWrapper data-test="metadata">
      {rows.map(({ label, value, key }) => (
        <MetadataItem key={key ? key : label} label={label}>
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

export default Metadata
