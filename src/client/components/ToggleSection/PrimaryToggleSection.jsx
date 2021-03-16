import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { BLUE, GREY_3, RED } from 'govuk-colours'
import { FONT_WEIGHTS } from '@govuk-react/constants'

import icon from './assets/search-gov.uk.svg'

const ToggleContainer = styled('div')`
  ${({ major }) => `
    margin-bottom: 10px;
    border: solid 2px ${GREY_3};
    border-top-color: ${major ? RED : BLUE};
  `}
`

const StyledHeader = styled('div')`
  display: flex;
  align-items: center;
  background-color: ${GREY_3};
`

const StyledContent = styled('div')`
  ${({ isOpen }) => `
    display: ${isOpen ? 'block' : 'none'};
    padding: 0 15px;
    margin: 15px 0;
  `}
`

const StyledButton = styled('button')`
  ${({ isOpen }) => `
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    font-size: 19px;
    color: #005ea5;
    cursor: pointer;
    font-weight: ${FONT_WEIGHTS.regular};
    padding: 13px 0;

    &::before {
      content: '';
      background: url(${icon}) 7px 0 no-repeat;
      width: 44px;
      height: 30px;
      transform: ${isOpen ? `rotate(0deg)` : `rotate(180deg)`};
    }
    &:hover {
      text-decoration: underline;
    }
    &:focus {
      outline: none;
      text-decoration: none;
    }
  `}
`

const ButtonContent = styled('span')`
  text-decoration: underline;
`

const BadgeContainer = styled('span')`
  margin-left: 5px;
`

const PrimaryToggleSection = ({
  label,
  badge = null,
  open,
  isOpen = false,
  children,
  ...props
}) => (
  <ToggleContainer {...props}>
    <StyledHeader>
      <StyledButton onClick={() => open(!isOpen)} isOpen={isOpen}>
        <ButtonContent>{label}</ButtonContent>
      </StyledButton>
      {badge && <BadgeContainer>{badge}</BadgeContainer>}
    </StyledHeader>
    <StyledContent isOpen={isOpen}>{children}</StyledContent>
  </ToggleContainer>
)

PrimaryToggleSection.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  badge: PropTypes.node,
  open: PropTypes.func,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  major: PropTypes.bool,
}

export default PrimaryToggleSection
