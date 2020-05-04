import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import { GREY_3, BLACK, GREY_2 } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import { spacing } from '@govuk-react/lib'
import styled from 'styled-components'

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
  }
`

const Icon = styled.img`
  transform: ${({ active }) => (active ? 'rotate(0deg)' : 'rotate(-90deg)')};
  margin-left: ${SPACING.SCALE_3};
  transition: transform 300ms ease;
  transform-origin: center;
`

const DropdownToggleButton = styled(Button)`
  font-weight: Bold;
`

export const DropdownButton = styled(Button)`
  ${spacing.responsive({
    size: 3,
    property: 'margin-bottom',
  })}
  &:last-child {
    margin-bottom: 0;
  }
`

const DropdownMenu = ({ label, children, closedLabel, onClick, open }) => {
  return (
    <DropdownMenuContainer>
      <DropdownToggleButton
        buttonShadowColour="transparent"
        buttonColour={GREY_3}
        buttonTextColour={BLACK}
        onClick={() => onClick(!open)}
        icon={<Icon src={trianglePng} active={open} />}
        aria-haspopup={true}
        aria-expanded={open}
      >
        {(open ? closedLabel : label) || label}
      </DropdownToggleButton>
      {open && <DropdownMenuGroup>{children}</DropdownMenuGroup>}
    </DropdownMenuContainer>
  )
}

DropdownMenu.propTypes = {
  label: PropTypes.string.isRequired,
  closedLabel: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  open: PropTypes.bool,
}

export default DropdownMenu
