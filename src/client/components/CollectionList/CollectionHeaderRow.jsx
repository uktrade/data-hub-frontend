import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, GREY_2 } from 'govuk-colours'
import { FONT_SIZE, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

const StyledRowWrapper = styled('div')`
  display: flex;
  flex-flow: row wrap;
  font-size: ${FONT_SIZE.SIZE_16};
  padding: ${SPACING.SCALE_2} 0;
  border-bottom: ${({ primary }) =>
    primary ? `${SPACING.SCALE_1} solid ${BLACK}` : `1px solid ${GREY_2}`};
`

const StyledActions = styled('div')`
  text-align: right;
  width: 100%;
  ${MEDIA_QUERIES.TABLET} {
    width: 0;
    flex-grow: 1;
  }
`

function CollectionHeaderRow({ primary, actions, children }) {
  return (
    <StyledRowWrapper primary={primary}>
      {children}

      {actions && <StyledActions>{actions}</StyledActions>}
    </StyledRowWrapper>
  )
}

CollectionHeaderRow.propTypes = {
  primary: PropTypes.bool,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
}

CollectionHeaderRow.defaultProps = {
  primary: false,
  actions: null,
}

export default CollectionHeaderRow
