import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { BLACK, GREY_1 } from 'govuk-colours'

const StyledMetaWrapper = styled('div')`
  color: ${BLACK};
`

const StyledItemLabel = styled('span')`
  color: ${GREY_1};
`

function MetadataItem({ label, children }) {
  return (
    <StyledMetaWrapper>
      {label && <StyledItemLabel>{label}</StyledItemLabel>} {children}
    </StyledMetaWrapper>
  )
}

MetadataItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
}

MetadataItem.defaultProps = {
  label: null,
}

export default MetadataItem
