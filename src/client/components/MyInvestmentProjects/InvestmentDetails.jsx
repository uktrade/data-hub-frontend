import React from 'react'
import styled from 'styled-components'
import { GREY_3 } from 'govuk-colours'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import { companies, interactions } from '../../../lib/urls'
import { format } from '../../utils/date-utils'
import { DARK_GREY } from '../../utils/colors'

const StyledDiv = styled('div')`
  height: 100%;
  background-color: ${GREY_3};
  padding: 9px ${SPACING.SCALE_2} 8px ${SPACING.SCALE_2};
`

const StyledHeader = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: ${FONT_WEIGHTS.bold};
  margin-bottom: 0;
`

const StyledDL = styled('dl')`
  font-size: ${FONT_SIZE.SIZE_16};
`

const StyledDT = styled('dt')`
  color: ${DARK_GREY};
  float: left;
  clear: left;
  margin-right: 5px;
`

const StyledDD = styled('dd')`
  margin-left: 0px;
`

const Truncate = styled('span')`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const InvestmentDetails = ({
  investor,
  sector,
  countryOrigin,
  latestInteraction,
}) => (
  <StyledDiv data-test="investment-details">
    <StyledHeader>Details</StyledHeader>
    <StyledDL>
      <StyledDT>Investor:</StyledDT>
      <StyledDD>
        <a href={companies.details(investor.id)}>{investor.name}</a>
      </StyledDD>
      <StyledDT>Sector:</StyledDT>
      <StyledDD>
        <Truncate>{sector.name}</Truncate>
      </StyledDD>
      {countryOrigin && (
        <>
          <StyledDT>Country of origin:</StyledDT>
          <StyledDD>{countryOrigin.name}</StyledDD>
        </>
      )}
      {latestInteraction && (
        <>
          <StyledDT>Last interaction:</StyledDT>
          <StyledDD>{format(latestInteraction.date)}</StyledDD>
          <StyledDT>Interaction subject:</StyledDT>
          <StyledDD>
            <a href={interactions.detail(latestInteraction.id)}>
              {latestInteraction.subject}
            </a>
          </StyledDD>
        </>
      )}
    </StyledDL>
  </StyledDiv>
)

export default InvestmentDetails
