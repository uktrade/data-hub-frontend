import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLUE } from 'govuk-colours'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import { TOGGLE_SECTION__TOGGLE } from '../../actions'
import multiInstance from '../../utils/multiinstance'

import icon from './assets/caret.svg'

const ToggleContainer = styled('div')``

export const ToggleHeader = styled('div')`
  display: flex;
  position: relative;
  ${({ justifyHeaderContent }) =>
    justifyHeaderContent
      ? `justify-content: space-between;`
      : `align-items: center;`}
`

export const ToggleButton = styled('button')`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  font-size: ${FONT_SIZE.SIZE_19};
  font-family: inherit;
  color: ${BLUE};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    outline: none;
    text-decoration: none;
  }
`

export const ToggleButtonIcon = styled('img')`
  width: 18px;
  height: 18px;
  margin-right: ${SPACING.SCALE_2};
  ${({ isOpen }) => `
    transform: ${isOpen ? `rotate(0deg)` : `rotate(180deg)`};
  `}
`

export const ButtonContent = styled('span')``

export const BadgeContainer = styled('span')`
  margin-left: ${SPACING.SCALE_1};
`

export const ToggleContent = styled('div')`
  ${({ isOpen }) => `
    display: ${isOpen ? 'block' : 'none'};
    padding: 0;
  `}
`

const BaseToggleSection = ({
  label,
  badge = null,
  open,
  isOpen = false,
  children,
  justifyHeaderContent = false,
  ...props
}) => (
  <ToggleContainer {...props}>
    <ToggleHeader justifyHeaderContent={justifyHeaderContent}>
      <ToggleButton
        data-test="toggle-section-button"
        onClick={() => open(!isOpen)}
        isOpen={isOpen}
      >
        <ToggleButtonIcon
          src={icon}
          onClick={() => open(!isOpen)}
          isOpen={isOpen}
          alt="Toggle details"
        />
        <ButtonContent data-test="toggle-section-button-content">
          {label}
        </ButtonContent>
      </ToggleButton>
      {badge && <BadgeContainer>{badge}</BadgeContainer>}
    </ToggleHeader>
    <ToggleContent isOpen={isOpen}>{children}</ToggleContent>
  </ToggleContainer>
)

BaseToggleSection.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  badge: PropTypes.node,
  open: PropTypes.func,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  major: PropTypes.bool,
  justifyHeaderContent: PropTypes.bool,
}

export const MultiInstanceToggleSection = multiInstance({
  name: 'ToggleSection',
  actionPattern: 'TOGGLE_SECTION__',
  dispatchToProps: (dispatch) => ({
    open: (isOpen) =>
      dispatch({
        type: TOGGLE_SECTION__TOGGLE,
        isOpen,
      }),
  }),
  component: BaseToggleSection,
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

export default MultiInstanceToggleSection
