import React from 'react'
import styled from 'styled-components'
import { BLACK, YELLOW } from 'govuk-colours'
import { FONT_WEIGHTS } from '@govuk-react/constants'
import { get } from 'lodash'

import multiInstance from '../../utils/multiinstance'
import { TOGGLE_SECTION__TOGGLE } from '../../actions'
import icon from './assets/search-gov.uk.svg'

const ToggleContainer = styled('div')`
  ${({ major, theme }) => `
      margin-bottom: 10px;
      border: ${get(theme, 'toggleSection.border', '0')};
      border-color: ${get(theme, 'toggleSection.borderColor', 'inherit')};
      border-top-color: ${
        major
          ? get(theme, 'toggleSection.majorHighlight', 'transparent')
          : get(theme, 'toggleSection.highlight', 'transparent')
      };
    `}
`

const StyledHeader = styled('div')`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    background-color: ${get(theme, 'toggleSection.headerColour', 'unset')};
  `}
`

const StyledContent = styled('div')`
  ${({ isOpen, theme }) => `
    display: ${isOpen ? 'block' : 'none'};
    margin-bottom: 10px;
    padding: ${get(theme, 'toggleSection.contentPadding', '0')};
  `}
`

const StyledButton = styled('button')`
  ${({ isOpen, theme }) => `
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    font-size: 19px;
    font-weight: ${get(
      theme,
      'toggleSection.buttonFontWeight',
      FONT_WEIGHTS.BOLD
    )};
    color: #005ea5;
    padding: ${get(theme, 'toggleSection.buttonPadding', '0 0 15px 0')};
    cursor: pointer;

    &::before {
      content: '';
      ${
        get(theme, 'toggleSection.wideToggleIcon')
          ? `
            background: url(${icon}) 7px 0 no-repeat;
            width: 44px;
          `
          : `
            background: url(${icon}) 0 0 no-repeat;
            width: 30px;
          `
      };
      height: 30px;
      transform: ${isOpen ? `rotate(0deg)` : `rotate(180deg)`};
    }
    &:hover {
      text-decoration: underline;
    }
    &:focus {
      outline: none;
      text-decoration: none;
      span {
        color: ${BLACK};
        background-color: ${YELLOW};
        box-shadow: 0 -2px ${YELLOW}, 0 4px ${BLACK};
      }
    }
  `}
`

const ButtonContent = styled('span')`
  ${({ theme }) => `
    text-decoration: ${get(theme, 'toggleSection.buttonDecoration', 'none')};
  `}
`
const BadgeContainer = styled('span')`
  margin-left: 5px;
`

const ToggleSection = ({
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

export default multiInstance({
  name: 'ToggleSection',
  actionPattern: 'TOGGLE_SECTION__',
  dispatchToProps: (dispatch) => ({
    open: (isOpen) =>
      dispatch({
        type: TOGGLE_SECTION__TOGGLE,
        isOpen,
      }),
  }),
  component: ToggleSection,
  reducer: (state = {}, { type, isOpen }) => {
    switch (type) {
      case TOGGLE_SECTION__TOGGLE:
        return {
          ...state,
          isOpen,
        }
      default:
        return state
    }
  },
})
