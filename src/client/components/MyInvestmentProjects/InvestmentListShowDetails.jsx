import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { default as Checkbox } from '../ActivityFeed/ActivityFeedCheckbox.jsx'

const CheckboxContainer = styled('div')`
  padding: ${SPACING.SCALE_2};
`

const InvestmentListShowDetails = ({ children, ...rest }) => {
  return (
    <CheckboxContainer>
      <Checkbox name="investmentListShowDetails" {...rest}>
        {children}
      </Checkbox>
    </CheckboxContainer>
  )
}

InvestmentListShowDetails.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default InvestmentListShowDetails
