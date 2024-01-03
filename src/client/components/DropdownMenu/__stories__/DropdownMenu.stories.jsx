import React from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import DropdownMenu, { DropdownButton } from 'DropdownMenu'

import { GREY_3, BLACK } from '../../../../client/utils/colours'
import noCloseLabelReadme from './noCloseLabel.md'

const StyledDiv = styled.div`
  width: 30%;
`

export default {
  component: DropdownMenu,
  title: 'DropdownMenu',
}

const withState = (Component) => () => {
  const [isOpen, setState] = React.useState(false)
  const [activeIndex, onUpdateIndex] = React.useState(void 0)
  const clickAction = action('click')
  return (
    <StyledDiv>
      <Component
        closeMenu={() => setState(false)}
        activeIndex={activeIndex}
        onUpdateIndex={onUpdateIndex}
        open={isOpen}
        onClick={(nextState) => {
          clickAction(nextState)
          setState(nextState)
        }}
      />
    </StyledDiv>
  )
}

const DefaultComponent = (props) => (
  <DropdownMenu label="View options" closedLabel="Hide options" {...props}>
    <DropdownButton buttonColour={GREY_3} buttonTextColour={BLACK}>
      Add to or remove from list
    </DropdownButton>
    <DropdownButton buttonColour={GREY_3} buttonTextColour={BLACK}>
      Add to pipeline
    </DropdownButton>
  </DropdownMenu>
)

export const Default = withState(DefaultComponent)

const NoClosedLabelComponent = (props) => (
  <DropdownMenu label="View options" {...props}>
    <DropdownButton buttonColour={GREY_3} buttonTextColour={BLACK}>
      Add to or remove from list
    </DropdownButton>
    <DropdownButton buttonColour={GREY_3} buttonTextColour={BLACK}>
      Add to pipeline
    </DropdownButton>
  </DropdownMenu>
)

export const NoClosedLabel = withState(NoClosedLabelComponent)

NoClosedLabel.story = {
  parameters: {
    docs: {
      storyDescription: noCloseLabelReadme,
    },
  },
}
