import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { GREY_1, GREY_4 } from '../../utils/colours'

const StyledHeaderDetails = styled('div')`
  background-color: ${GREY_4};
`

const StyledHeaderList = styled('ul')({})

const StyledHeaderListItem = styled('li')`
  display: inline-block;
  padding-right: ${SPACING.SCALE_5};
`

const StyledHeaderListLabel = styled('label')`
  color: ${GREY_1};
`

/**
 * A component to be used within the `LocalHeader` component to add more information to a header.
 */
const LocalHeaderDetails = ({ items }) => (
  <StyledHeaderDetails
    aria-label="local header details"
    data-test="localHeaderDetails"
    role="region"
  >
    <StyledHeaderList>
      {items.map((item) => (
        <StyledHeaderListItem key={item.label}>
          <StyledHeaderListLabel>{item.label}</StyledHeaderListLabel>
          <p>{item.value}</p>
        </StyledHeaderListItem>
      ))}
    </StyledHeaderList>
  </StyledHeaderDetails>
)

LocalHeaderDetails.propTypes = {
  /**
   * Contains the details items to display in a LocalHeader.
   * Takes an array of objects with labels and values, displayed as pairs horizontally in the header.
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
    })
  ).isRequired,
}

export default LocalHeaderDetails
