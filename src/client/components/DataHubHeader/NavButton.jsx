import React from 'react'
import { MEDIA_QUERIES, FONT_SIZE, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'
import { BLACK, WHITE, YELLOW } from 'govuk-colours'

const Button = styled.button(({ showVerticalNav }) => ({
  display: 'block',
  position: 'absolute',
  fontWeight: 400,
  fontSize: FONT_SIZE.SIZE_14,
  top: SPACING.SCALE_4,
  right: SPACING.SCALE_5,
  margin: 0,
  padding: 0,
  border: 0,
  color: WHITE,
  background: '0 0',
  outline: 'none',
  ':focus': {
    color: BLACK,
    background: YELLOW,
  },
  '&::after': {
    content: '""',
    display: 'inline-block',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderBottomColor: 'inherit',
    borderTopColor: 'inherit',
    marginLeft: SPACING.SCALE_1,
    ...(showVerticalNav
      ? {
          clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
          borderWidth: '0 5px 8px 5px',
        }
      : {
          clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
          borderWidth: '8px 5px 0 5px',
        }),
  },
  [MEDIA_QUERIES.TABLET]: {
    display: 'none',
  },
}))

const NavButton = ({ onShowVerticalNav, showVerticalNav }) => (
  <Button
    showVerticalNav={showVerticalNav}
    onClick={() => onShowVerticalNav(!showVerticalNav)}
    role="button"
    aria-label="Show or hide navigation"
    aria-controls="navigation sub-navigation logo-navigation"
  >
    Menu
  </Button>
)

export default NavButton
