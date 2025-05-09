import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { BLACK, DARK_GREY, WHITE } from '../../utils/colours'

const StyledItemLabel = styled('dt')((props) => ({
  color: props.active ? WHITE : DARK_GREY,
  display: 'inline',
  clear: 'left',
  float: 'left',
  marginRight: '0.5em',
}))

const StyledItemValues = styled('dd')((props) => ({
  color: props.active ? WHITE : BLACK,
  float: 'left',
}))

function MetadataItem({ label, children, active = false }) {
  return (
    <>
      {label && (
        <StyledItemLabel active={active} data-test="metadata-label">
          {label}
        </StyledItemLabel>
      )}
      {
        <StyledItemValues active={active} data-test="metadata-value">
          {children}
        </StyledItemValues>
      }
    </>
  )
}

MetadataItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
}

export default MetadataItem
