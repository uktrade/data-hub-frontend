import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import InvestmentCheckbox from './InvestmentCheckbox'

const CheckboxContainer = styled('div')`
  padding: ${SPACING.SCALE_2};
`

const InvestmentListShowDetails = ({ children, ...rest }) => {
  return (
    <CheckboxContainer>
      <InvestmentCheckbox name="investmentListShowDetails" {...rest}>
        {children}
      </InvestmentCheckbox>
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
