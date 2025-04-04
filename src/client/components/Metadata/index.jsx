import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'

import MetadataItem from './MetadataItem'
import { TEXT_COLOUR, WHITE } from '../../utils/colours'

const StyledMetadataWrapper = styled('div')((props) => ({
  fontSize: FONT_SIZE.SIZE_16,
  lineHeight: FONT_SIZE.SIZE_27,
  display: 'block',
  overflow: 'hidden',
  color: props.active ? WHITE : TEXT_COLOUR,
}))

const Metadata = ({ rows, active = false }) =>
  rows && (
    <StyledMetadataWrapper data-test="metadata">
      {rows.map(({ label, value, key }) => (
        <MetadataItem active={active} key={key ? key : label} label={label}>
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
  active: PropTypes.bool,
}

export default Metadata
