import React from 'react'
import PropTypes from 'prop-types'
import { GREY_2 } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import { spacing } from '@govuk-react/lib'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import SecondaryButton from '../../components/SecondaryButton'
import trianglePng from '../../../../assets/images/icon-triangle.svg'

const DropdownMenuContainer = styled.div`
  position: relative;
`

const DropdownMenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${SPACING.SCALE_3};
  background-color: ${GREY_2};
  ${spacing.responsive({
    size: -5,
    property: 'margin-top',
  })}
  ${MEDIA_QUERIES.TABLET} {
    position: absolute;
    z-index: 1;
  }
`

const Icon = styled.img`
  transform: ${({ active }) => (active ? 'rotate(0deg)' : 'rotate(-90deg)')};
  margin-left: ${SPACING.SCALE_3};
  transition: transform 300ms ease;
  transform-origin: center;
`

const DropdownToggleButton = styled(SecondaryButton)`
  font-weight: Bold;
`

export const DropdownButton = styled(SecondaryButton).attrs(() => ({
  tabIndex: '-1',
  role: 'option',
  forwardedAs: Link,
}))`
  ${spacing.responsive({
    size: 3,
    property: 'margin-bottom',
  })}
  &:last-child {
    margin-bottom: 0;
  }
`
const KEY_ARROW_UP = 38
const KEY_ARROW_DOWN = 40
const KEY_TAB = 9
const KEY_ESC = 27
const KEY_HOME = 36
const KEY_END = 35

const DropdownMenu = ({
  label,
  children,
  closedLabel,
  onClick,
  open,
  activeIndex,
  onUpdateIndex,
  closeMenu,
}) => {
  const buttonRef = React.useRef(null)
  const childrenGroupRef = React.useRef(null)
  const onKeyUp = ({ keyCode }) => {
    switch (keyCode) {
      case KEY_ARROW_UP:
        onUpdateIndex(Math.max(0, (activeIndex ?? 0) - 1))
        break
      case KEY_ARROW_DOWN:
        onUpdateIndex(Math.min((activeIndex ?? -1) + 1, children.length - 1))
        break
      case KEY_HOME:
        onUpdateIndex(0)
        break
      case KEY_END:
        onUpdateIndex(children.length - 1)
        break
    }
  }

  const onKeyDown = (event) => {
    switch (event.keyCode) {
      case KEY_TAB:
      case KEY_ESC:
        closeMenu()
      case KEY_ESC:
        buttonRef.current && buttonRef.current.focus()
        break
      case KEY_HOME:
      case KEY_END:
      case KEY_ARROW_UP:
      case KEY_ARROW_DOWN:
        if (open) {
          // Prevent page scrolling if open
          event.preventDefault()
        }
        break
    }
  }

  React.useEffect(() => {
    if (!isNaN(activeIndex) && childrenGroupRef.current) {
      childrenGroupRef.current.children[activeIndex].focus()
    }
  }, [activeIndex])

  return (
    <DropdownMenuContainer onKeyUp={onKeyUp} onKeyDown={onKeyDown}>
      <DropdownToggleButton
        ref={buttonRef}
        buttonShadowColour="transparent"
        onClick={() => onClick(!open)}
        icon={<Icon src={trianglePng} active={open} />}
        aria-haspopup={true}
        aria-expanded={open}
      >
        {(open ? closedLabel : label) || label}
      </DropdownToggleButton>
      {open && (
        <DropdownMenuGroup ref={childrenGroupRef}>{children}</DropdownMenuGroup>
      )}
    </DropdownMenuContainer>
  )
}

DropdownMenu.propTypes = {
  onUpdateIndex: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  activeIndex: PropTypes.number,
  label: PropTypes.string.isRequired,
  closedLabel: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  open: PropTypes.bool,
}

export default DropdownMenu
