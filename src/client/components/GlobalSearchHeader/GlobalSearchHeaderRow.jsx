import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, GREY_2 } from 'govuk-colours'
import { FONT_SIZE, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

const StyledRowWrapper = styled('div')`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  font-size: ${FONT_SIZE.SIZE_16};
  padding: ${SPACING.SCALE_2} 0;
  border-bottom: ${({ primary }) =>
    primary ? `${SPACING.SCALE_1} solid ${BLACK}` : `1px solid ${GREY_2}`};
`

const StyledActions = styled('div')`
  width: 100%;
  margin-top: ${SPACING.SCALE_2};

  ${MEDIA_QUERIES.TABLET} {
    margin-top: 0;
    margin-left: ${SPACING.SCALE_1};
    display: flex;
    justify-content: flex-end;
    flex-basis: 0;
    flex-grow: 1;
  }
`

const GlobalSearchHeaderRow = ({ primary, actions, children, ...rest }) => {
  return (
    <StyledRowWrapper primary={primary} {...rest}>
      {children}
      {actions[0] && <StyledActions>{actions}</StyledActions>}
    </StyledRowWrapper>
  )
}

GlobalSearchHeaderRow.propTypes = {
  primary: PropTypes.bool,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
}

GlobalSearchHeaderRow.defaultProps = {
  primary: false,
  actions: null,
}

export default GlobalSearchHeaderRow
