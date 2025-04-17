import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { BLACK, DARK_GREY, WHITE } from '../../utils/colours'

const StyledMetaWrapper = styled('div')((props) => ({
  color: props.active ? WHITE : BLACK,
}))

const StyledItemLabel = styled('span')((props) => ({
  color: props.active ? WHITE : DARK_GREY,
}))

function MetadataItem({ label, children, active = false }) {
  return (
    <StyledMetaWrapper active={active} data-test="metadata-item">
      {label && <StyledItemLabel active={active}>{label}</StyledItemLabel>}{' '}
      {children}
    </StyledMetaWrapper>
  )
}

MetadataItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
}

export default MetadataItem
