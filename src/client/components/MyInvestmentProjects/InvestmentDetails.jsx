import React from 'react'
import styled from 'styled-components'
import { GREY_3 } from 'govuk-colours'
import Link from '@govuk-react/link'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import { companies, interactions } from '../../../lib/urls'
import { format } from '../../utils/date-utils'
import { DARK_GREY } from '../../utils/colors'

const StyledDiv = styled('div')({
  height: '100%',
  backgroundColor: GREY_3,
  padding: `9px ${SPACING.SCALE_2} 8px ${SPACING.SCALE_2}`,
})

const StyledHeader = styled('h3')({
  fontSize: FONT_SIZE.SIZE_16,
  fontWeight: FONT_WEIGHTS.bold,
  marginBottom: 0,
})

const StyledDL = styled('dl')({
  fontSize: FONT_SIZE.SIZE_16,
})

const lineHeightMixin = {
  lineHeight: '1.5',
}

const StyledDT = styled('dt')({
  color: DARK_GREY,
  float: 'left',
  clear: 'left',
  marginRight: '5px',
  ...lineHeightMixin,
})

const StyledDD = styled('dd')({
  ...lineHeightMixin,
})

const Truncate = styled('span')({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})

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
        <Link href={companies.details(investor.id)}>
          <Truncate>{investor.name}</Truncate>
        </Link>
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
