import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { BLACK, DARK_GREY } from '../../utils/colours'

const StyledMetaWrapper = styled('div')`
  color: ${BLACK};
`

const StyledItemValues = styled('dd')`
  color: ${BLACK};
  display: inline;
`

const StyledItemLabel = styled('dt')`
  color: ${DARK_GREY};
  display: inline;
`

function MetadataItem({ label, children }) {
  return (
    <StyledMetaWrapper data-test="metadata-item" role="presentation">
      {label && <StyledItemLabel>{label}</StyledItemLabel>}{' '}
      {<StyledItemValues>{children}</StyledItemValues>}
    </StyledMetaWrapper>
  )
}

MetadataItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default MetadataItem
