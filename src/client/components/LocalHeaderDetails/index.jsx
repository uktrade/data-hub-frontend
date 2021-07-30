import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_1, GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

const StyledHeaderDetails = styled('div')`
  background-color: ${GREY_4};
`

const StyledHeaderList = styled('li')`
  display: inline-block;
  padding-right: ${SPACING.SCALE_5};
`

const StyledHeaderListLabel = styled('label')`
  color: ${GREY_1};
`

const LocalHeaderDetails = ({ items }) => (
  <StyledHeaderDetails
    aria-label="local header details"
    data-test="localHeaderDetails"
    role="region"
  >
    {items.map((item) => (
      <StyledHeaderList key={item.label}>
        <StyledHeaderListLabel>{item.label}</StyledHeaderListLabel>
        <p>{item.value}</p>
      </StyledHeaderList>
    ))}
  </StyledHeaderDetails>
)

LocalHeaderDetails.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
}

export default LocalHeaderDetails
