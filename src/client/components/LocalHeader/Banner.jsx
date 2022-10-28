import React from 'react'
import styled from 'styled-components'

import { WHITE } from 'govuk-colours'

const MEDIUMBLUE = '#003399'

const StyledBody = styled('div')`
  background-color: ${MEDIUMBLUE};
  color: ${WHITE};
  height: 20%;
`

const StyledDiv = styled('div')`
  margin-left: 20%;
  position: relative;
  padding-top: 0.2%;
`

const StyledTextLink = styled('a')`
  position: relative;
  color: ${WHITE};
  margin-left: 5px;
`

const StyledDismissTextLink = styled('a')`
  position: relative;
  color: ${WHITE};
  margin-left: 3%;
`

export const Banner = ({}) => {
  return (
    <StyledBody>
      <StyledDiv>
        Update:
        <StyledTextLink href="/sdf">
          Email notifications for projects with no interactions
        </StyledTextLink>
        <StyledDismissTextLink href="/sdf">Dismiss</StyledDismissTextLink>
      </StyledDiv>
    </StyledBody>
  )
}
