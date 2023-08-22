import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { GREY_2 } from '../../../../utils/colours'

const StyledCardWrapper = styled('div')`
  border-bottom: 1px solid ${GREY_2};
  padding-bottom: 10px;
`

const OverviewActivityCardWrapper = ({
  children,
  dataTest = 'activity-card-wrapper',
}) => <StyledCardWrapper data-test={dataTest}>{children}</StyledCardWrapper>

OverviewActivityCardWrapper.propTypes = {
  dataTest: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default OverviewActivityCardWrapper
