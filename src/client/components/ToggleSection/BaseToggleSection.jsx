import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, BLUE } from '../../../client/utils/colours'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import { TOGGLE_SECTION__TOGGLE } from '../../actions'
import multiInstance from '../../utils/multiinstance'

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

export const ToggleButtonIconStyle = styled('span')`
  margin-right: ${SPACING.SCALE_2};
  ${({ isOpen }) => `
    transform: ${isOpen ? `rotate(0deg)` : `rotate(180deg)`};
  `}
`

export const ToggleButtonIcon = ({ colour = BLACK, isOpen }) => (
  <ToggleButtonIconStyle isOpen={isOpen}>
    <svg
      width="18px"
      height="18px"
      version="1.1"
      viewBox="210 275 600 425"
      xmlns="http://www.w3.org/2000/svg"
      class="app-c-expander__icon app-c-expander__icon--up"
      aria-hidden="true"
      focusable="false"
      fill={colour}
    >
      <path d="m798.16 609.84l-256-256c-16.683-16.683-43.691-16.683-60.331 0l-256 256c-16.683 16.683-16.683 43.691 0 60.331s43.691 16.683 60.331 0l225.84-225.84 225.84 225.84c16.683 16.683 43.691 16.683 60.331 0s16.683-43.691 0-60.331z" />
    </svg>
  </ToggleButtonIconStyle>
)

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
  onOpen,
  isOpen = false,
  colour = BLACK,
  children,
  justifyHeaderContent = false,
  ...props
}) => (
  <ToggleContainer {...props}>
    <ToggleHeader justifyHeaderContent={justifyHeaderContent}>
      <ToggleButton
        id={
          props.id && `${props.id}-toggle-button-${isOpen ? 'close' : 'open'}`
        }
        data-test="toggle-section-button"
        onClick={() => {
          open(!isOpen)
          onOpen && onOpen(!isOpen)
        }}
        isOpen={isOpen}
        aria-expanded={isOpen}
      >
        <ToggleButtonIcon
          onClick={() => {
            open(!isOpen)
            onOpen && onOpen(!isOpen)
          }}
          isOpen={isOpen}
          colour={colour}
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
  onOpen: PropTypes.func,
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
