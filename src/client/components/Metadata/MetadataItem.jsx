import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { BLACK, DARK_GREY } from '../../utils/colours'

const StyledItemLabel = styled('dt')`
  color: ${DARK_GREY};
  display: inline;
  clear: left;
  float: left;
  margin-right: 0.5em;
`

const StyledItemValues = styled('dd')`
  color: ${BLACK};
  float: left;
`

function MetadataItem({ label, children }) {
  return (
    <>
      {label && <StyledItemLabel>{label}</StyledItemLabel>}{' '}
      {<StyledItemValues>{children}</StyledItemValues>}
    </>
  )
}

MetadataItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default MetadataItem
