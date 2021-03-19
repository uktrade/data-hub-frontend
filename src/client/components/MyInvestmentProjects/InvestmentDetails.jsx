import React from 'react'
import styled from 'styled-components'
import { GREY_3 } from 'govuk-colours'
import { format, parseISO } from 'date-fns'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import { companies, interactions } from '../../../lib/urls'

const StyledDiv = styled('div')`
  background-color: ${GREY_3};
  padding: ${SPACING.SCALE_3} ${SPACING.SCALE_2};
`

const StyledHeader = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: ${FONT_WEIGHTS.bold};
  margin-bottom: 0;
`

const StyledList = styled('ul')`
  font-size: ${FONT_SIZE.SIZE_16};
`
const StyledSpan = styled('span')`
  /* This color is not in gov-react but is in the GDS design system */
  color: #505a5f;
`

const InvestmentDetails = ({
  investor,
  sector,
  countryOrigin,
  latestInteraction,
}) => (
  <StyledDiv data-test="investment-details">
    <StyledHeader>Details</StyledHeader>
    <StyledList>
      <li>
        <StyledSpan>Investor: </StyledSpan>
        <a href={companies.details(investor.id)}>{investor.name}</a>
      </li>
      <li>
        <StyledSpan>Sector: </StyledSpan>
        {sector.name}
      </li>
      {countryOrigin && (
        <li>
          <StyledSpan>Country of origin: </StyledSpan>
          {countryOrigin.name}
        </li>
      )}
      {latestInteraction && (
        <>
          <li>
            <StyledSpan>Last interaction: </StyledSpan>
            {format(new Date(parseISO(latestInteraction.date)), 'd MMM yyyy')}
          </li>
          <li>
            <StyledSpan>Interaction subject: </StyledSpan>
            <a href={interactions.detail(latestInteraction.id)}>
              {latestInteraction.subject}
            </a>
          </li>
        </>
      )}
    </StyledList>
  </StyledDiv>
)

export default InvestmentDetails
