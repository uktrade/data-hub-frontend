import React from 'react'
import PropTypes from 'prop-types'
import { SPACING } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'
import styled from 'styled-components'

const StyledCardWrapper = styled('div')`
  border-bottom: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_3} 0;
`

const ActivityCardWrapper = ({
  children,
  dataTest = 'activity-card-wrapper',
}) => <StyledCardWrapper data-test={dataTest}>{children}</StyledCardWrapper>

ActivityCardWrapper.propTypes = {
  dataTest: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default ActivityCardWrapper
