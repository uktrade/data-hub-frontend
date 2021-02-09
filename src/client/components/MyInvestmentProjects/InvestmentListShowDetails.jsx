import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { default as Checkbox } from '../ActivityFeed/ActivityFeedCheckbox.jsx'

const CheckboxContainer = styled('div')`
  padding: ${SPACING.SCALE_2};
`

const InvestmentListShowDetails = ({ onChange, checked, children }) => {
  return (
    <CheckboxContainer>
      <Checkbox
        name="investmentListShowDetails"
        onChange={onChange}
        checked={checked}
      >
        {children}
      </Checkbox>
    </CheckboxContainer>
  )
}

InvestmentListShowDetails.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}

export default InvestmentListShowDetails
