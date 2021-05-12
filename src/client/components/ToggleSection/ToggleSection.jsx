import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { BLACK, BLUE, GREY_3, RED, YELLOW } from 'govuk-colours'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import { VARIANTS } from '../../../common/constants'
import icon from './assets/caret.svg'

const ToggleContainer = styled('div')``

const ToggleHeader = styled('div')`
  display: flex;
  align-items: center;
`

const ToggleButton = styled('button')`
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

const ToggleButtonIcon = styled('img')`
  width: 18px;
  height: 18px;
  margin-right: ${SPACING.SCALE_2};
  ${({ isOpen }) => `
    transform: ${isOpen ? `rotate(0deg)` : `rotate(180deg)`};
  `}
`

const ButtonContent = styled('span')``

const BadgeContainer = styled('span')`
  margin-left: ${SPACING.SCALE_1};
`

const ToggleContent = styled('div')`
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
  ...props
}) => (
  <ToggleContainer {...props}>
    <ToggleHeader>
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

const PrimaryToggleSection = styled(BaseToggleSection)`
  ${({ major }) => `
    border: solid 2px ${GREY_3};
    border-top-color: ${major ? RED : BLUE};
  `}

  ${ToggleHeader} {
    background-color: ${GREY_3};
    padding-top: ${SPACING.SCALE_3};
    padding-bottom: ${SPACING.SCALE_3};
  }

  ${ToggleButton} {
    font-weight: ${FONT_WEIGHTS.regular};
    margin-left: ${SPACING.SCALE_2};
  }

  ${ButtonContent} {
    text-decoration: underline;
  }

  ${BadgeContainer} {
    margin-left: ${SPACING.SCALE_1};
  }

  ${ToggleContent} {
    padding: 0 ${SPACING.SCALE_3};
    margin-top: ${SPACING.SCALE_1};
    margin-bottom: ${SPACING.SCALE_3};
  }
`

const SecondaryToggleSection = styled(BaseToggleSection)`
  margin-bottom: ${SPACING.SCALE_2};

  ${ToggleButton} {
    &:focus ${ButtonContent} {
      color: ${BLACK};
      background-color: ${YELLOW};
      box-shadow: 0 -2px ${YELLOW}, 0 4px ${BLACK};
    }
  }
`

const TertiaryToggleSection = styled(BaseToggleSection)`
  ${ToggleButton} {
    padding: 0;
  }

  ${ButtonContent} {
    text-decoration: underline;
  }

  ${ToggleContent} {
    padding: ${SPACING.SCALE_2} 0;
  }
`

const ToggleSection = ({ variant, ...props }) =>
  variant === VARIANTS.TERTIARY ? (
    <TertiaryToggleSection {...props} />
  ) : variant === VARIANTS.SECONDARY ? (
    <SecondaryToggleSection {...props} />
  ) : (
    <PrimaryToggleSection {...props} />
  )

ToggleSection.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  badge: PropTypes.node,
  open: PropTypes.func,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  major: PropTypes.bool,
}

export default ToggleSection
