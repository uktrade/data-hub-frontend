import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import { GREY_1 } from 'govuk-colours'
import {
  FONT_SIZE,
  FONT_WEIGHTS,
  LINE_HEIGHT,
  SPACING,
} from '@govuk-react/constants'

import {
  Step,
  FieldRadios,
  FieldSelect,
} from '../../../../../client/components'
import { investments } from '../../../../../lib/urls'

const FDI = 'FDI'
const NON_FDI = 'Non-FDI'
const COMMITMENT_TO_INVEST = 'Commitment to invest'

const StyledLink = styled(Link)({
  fontSize: FONT_SIZE.SIZE_16,
  lineHeight: LINE_HEIGHT.SIZE_24,
  fontWeight: FONT_WEIGHTS.regular,
  marginTop: SPACING.SCALE_1,
  display: 'block',
  ':visited': {
    color: GREY_1,
  },
})

const InvestmentTypeStep = ({ investmentTypes = [], fdiTypes = [] }) => (
  <Step name="investmentType">
    <FieldRadios
      name="investment_type"
      legend="Investment type"
      required="Specify the type of investment"
      options={investmentTypes.map((option) => ({
        ...option,
        ...(option.label === FDI && {
          link: (
            <StyledLink
              href={investments.projects.typeInfo('#fdi')}
              target="info"
            >
              Is this an FDI project?
            </StyledLink>
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
            <StyledLink
              href={investments.projects.typeInfo('#non-fdi')}
              target="info"
            >
              Is this is a Non-FDI project?
            </StyledLink>
          ),
        }),
        ...(option.label === COMMITMENT_TO_INVEST && {
          link: (
            <StyledLink
              href={investments.projects.typeInfo('#cti')}
              target="info"
            >
              Is this a Commitment to Invest project?
            </StyledLink>
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
