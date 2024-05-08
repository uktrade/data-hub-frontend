import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { BLACK, DARK_GREY } from '../../utils/colours'

const StyledMetaWrapper = styled('div')`
  color: ${BLACK};
`

const StyledItemLabel = styled('span')`
  color: ${DARK_GREY};
`

function MetadataItem({ label, children }) {
  return (
    <StyledMetaWrapper data-test="metadata-item">
      {label && <StyledItemLabel>{label}</StyledItemLabel>} {children}
    </StyledMetaWrapper>
  )
}

MetadataItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default MetadataItem
