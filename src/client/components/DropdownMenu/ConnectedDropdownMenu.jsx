import React from 'react'
import multiInstance from '../../../client/utils/multiinstance'
import DropdownMenu from './DropdownMenu'
import {
  DROP_DOWN_MENU_TOGGLE,
  DROP_DOWN_MENU_OPEN,
  DROP_DOWN_MENU_CLOSED,
  DROP_DOWN_MENU_UPDATE_INDEX,
} from '../../../client/actions'

const toggle = {
  type: DROP_DOWN_MENU_TOGGLE,
}

const open = {
  type: DROP_DOWN_MENU_OPEN,
}

const close = {
  type: DROP_DOWN_MENU_CLOSED,
}

const updateIndex = (activeIndex) => ({
  type: DROP_DOWN_MENU_UPDATE_INDEX,
  activeIndex,
})

function reducer(state = {}, { type, ...rest }) {
  switch (type) {
    case DROP_DOWN_MENU_OPEN:
      return { open: true }
    case DROP_DOWN_MENU_CLOSED:
      return { open: false }
    case DROP_DOWN_MENU_TOGGLE:
      return { open: !state.open }
    case DROP_DOWN_MENU_UPDATE_INDEX:
      return { ...state, activeIndex: rest.activeIndex }
  }
  return state
}

const dispatchToProps = (dispatch) => ({
  openMenu: dispatch.bind(void 0, open),
  closeMenu: dispatch.bind(void 0, close),
  toggleMenu: dispatch.bind(void 0, toggle),
  onUpdateIndex: (activeIndex) => dispatch(updateIndex(activeIndex)),
})

export default multiInstance({
  name: 'DropdownMenu',
  actionPattern: 'DROP_DOWN_MENU',
  component: (props) => (
    <DropdownMenu {...props} onClick={() => props.toggleMenu()} />
  ),
  reducer,
  dispatchToProps,
})
