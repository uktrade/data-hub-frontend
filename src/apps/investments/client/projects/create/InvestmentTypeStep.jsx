import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@govuk-react/link'

import {
  Step,
  FieldRadios,
  FieldSelect,
} from '../../../../../client/components'

import { GREY_1 } from 'govuk-colours'

import {
  FONT_SIZE,
  FONT_WEIGHTS,
  LINE_HEIGHT,
  SPACING,
} from '@govuk-react/constants'

const FDI = 'FDI'
const NON_FDI = 'Non-FDI'
const COMMITMENT_TO_INVEST = 'Commitment to invest'

const StyledLinkContainer = styled('span')({
  fontSize: FONT_SIZE.SIZE_16,
  lineHeight: LINE_HEIGHT.SIZE_24,
  fontWeight: FONT_WEIGHTS.regular,
  marginTop: SPACING.SCALE_1,
  display: 'block',
  color: GREY_1,
})

const StyledLink = styled(Link)({
  ':visited': {
    color: GREY_1,
  },
})

const InvestmentTypeDescriptionLink = ({ url, text }) => (
  <StyledLinkContainer>
    <StyledLink href={url} target="info">
      {text}
    </StyledLink>
  </StyledLinkContainer>
)
const InvestmentTypeStep = ({ investmentTypes = [], fdiTypes = [] }) => (
  <Step name="investmentType">
    <FieldRadios
      name="investment_type"
      legend="Type of investment"
      required="Specify the type of investment"
      options={investmentTypes.map((option) => ({
        label: option.label,
        value: option.value,
        ...(option.label === FDI && {
          link: (
            <InvestmentTypeDescriptionLink
              url="/investments/projects/create/investment-type/info#fdi"
              text="Is this an FDI project?"
            />
          ),
          children: (
            <FieldSelect
              name="fdi_type"
              emptyOption="Select an FDI type"
              options={fdiTypes}
              required="Select an FDI type"
              aria-label="select an FDI type"
            />
          ),
        }),
        ...(option.label === NON_FDI && {
          link: (
            <InvestmentTypeDescriptionLink
              url="/investments/projects/create/investment-type/info#non-fdi"
              text="Is this is a Non-FDI project?"
            />
          ),
        }),
        ...(option.label === COMMITMENT_TO_INVEST && {
          link: (
            <InvestmentTypeDescriptionLink
              url="/investments/projects/create/investment-type/info#cti"
              text="Is this a Commitment to Invest project?"
            />
          ),
        }),
      }))}
    />
  </Step>
)

const optionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

InvestmentTypeStep.propTypes = {
  investmentTypes: PropTypes.arrayOf(optionProp),
  fdiTypes: PropTypes.arrayOf(optionProp),
}

export default InvestmentTypeStep
