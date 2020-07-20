import React from 'react'
import { isEmpty } from 'lodash'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledInnerRow = styled('div')`
  padding: ${SPACING.SCALE_2} 0;

  ${MEDIA_QUERIES.TABLET} {
    display: inline-flex;
  }
`

const StyledDL = styled('dl')`
  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    flex-direction: column;
  }
`

const StyledDT = styled('dt')`
  padding-right: ${SPACING.SCALE_4};
  width: 30%;
  font-weight: bold;
`

const StyledDD = styled('dd')`
  width: 70%;
`

const SummaryList = ({ rows, ...rest }) =>
  rows ? (
    <StyledDL {...rest}>
      {rows
        .filter((r) => !isEmpty(r) && !isEmpty(r.value))
        .map(({ label, value }) => (
          <StyledInnerRow key={label}>
            <StyledDT>{label}</StyledDT>
            <StyledDD>
              {Array.isArray(value) ? value.join(', ') : value}
            </StyledDD>
          </StyledInnerRow>
        ))}
    </StyledDL>
  ) : null

SummaryList.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]),
    })
  ),
}

SummaryList.defaultProps = {
  rows: null,
}

export default SummaryList
