import React from 'react'
import UnorderedList from '@govuk-react/unordered-list'
import { H1, H3 } from '@govuk-react/heading'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import { MEDIA_QUERIES, SPACING, FONT_SIZE } from '@govuk-react/constants'

import { investments } from '../../../lib/urls'
import { DARK_GREY } from '../../utils/colors'
import TimelineImage from './timeline.png'

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${MEDIA_QUERIES.TABLET} {
    margin: 25px 0 50px 0;
  }
  ${MEDIA_QUERIES.DESKTOP} {
    margin: 45px 0 95px 0;
  }
`

const StyledParagraph = styled('p')`
  color: ${DARK_GREY};
  ${MEDIA_QUERIES.TABLET} {
    margin-bottom: 25px;
    font-size: ${FONT_SIZE.SIZE_24};
  }
`

const StyledImage = styled('img')`
  display: none;
  ${MEDIA_QUERIES.TABLET} {
    display: block;
    width: 655px;
    margin-bottom: ${SPACING.SCALE_3};
  }
  ${MEDIA_QUERIES.DESKTOP} {
    width: 760px;
    margin: ${SPACING.SCALE_3} 0 35px 0;
  }
`

const StyledUnorderedList = styled(UnorderedList)`
  color: ${DARK_GREY};
  margin-bottom: ${SPACING.SCALE_4};
  ${MEDIA_QUERIES.TABLET} {
    margin-left: 7px;
    margin-bottom: 40px;
  }
`

const StyledListItem = styled('li')`
  ${MEDIA_QUERIES.TABLET} {
    font-size: ${FONT_SIZE.SIZE_24};
  }
`

const NoInvestmentProjects = () => (
  <StyledContainer>
    <H3 as={H1}>No investment projects</H3>
    <StyledParagraph>
      View and track investment projects from your dashboard
    </StyledParagraph>
    <StyledImage
      src={TimelineImage}
      alt="An image of the stage timeline and estimated land date"
    />
    <div>
      <StyledParagraph>Once added, you'll be able to:</StyledParagraph>
      <StyledUnorderedList listStyleType="bullet">
        <StyledListItem>view the progress of each project</StyledListItem>
        <StyledListItem>move projects onto the next stage</StyledListItem>
        <StyledListItem>view estimated land dates</StyledListItem>
        <StyledListItem>
          view project summaries for the next financial year.
        </StyledListItem>
      </StyledUnorderedList>
    </div>
    <Button as={Link} href={investments.index()}>
      Add project
    </Button>
  </StyledContainer>
)

export default NoInvestmentProjects
