import { isEqual, xorWith } from 'lodash'

export const keys = {
  down: 'ArrowDown',
  end: 'End',
  enter: 'Enter',
  escape: 'Escape',
  home: 'Home',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  up: 'ArrowUp',
}

export const menuActions = {
  close: 'close',
  closeSelect: 'closeSelect',
  first: 'first',
  last: 'last',
  next: 'next',
  open: 'open',
  previous: 'previous',
  select: 'select',
  type: 'type',
}

export const getActionFromKey = (key, menuOpen) => {
  // handle opening when closed
  if (!menuOpen && key === keys.down) {
    return menuActions.open
  }

  // handle keys when open
  if (key === keys.down || key === keys.right) {
    return menuActions.next
  } else if (key === keys.up || key === keys.left) {
    return menuActions.previous
  } else if (key === keys.home) {
    return menuActions.first
  } else if (key === keys.end) {
    return menuActions.last
  } else if (key === keys.escape) {
    return menuActions.close
  } else if (key === keys.enter) {
    return menuActions.closeSelect
  }
}

export const getUpdatedIndex = (current, max, action) => {
  switch (action) {
    case menuActions.first:
      return 0
    case menuActions.last:
      return max
    case menuActions.previous:
      return Math.max(0, current - 1)
    case menuActions.next:
      return Math.min(max, current + 1)
    default:
      return current
  }
}

export const getFilteredOptions = ({ input, options }) =>
  input
    ? options.filter((option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      )
    : options

export const getNewSelectedOptions = ({ selectedOptions, option, isMulti }) =>
  isMulti ? xorWith(selectedOptions, [option], isEqual) : [option]

/**
 * Converts value to an array if it is not one already.
 *
 * If value is undefined, returns an empty array.
 **/
export const valueAsArray = (value) =>
  value ? (Array.isArray(value) ? value : [value]) : []

export const maintainScrollVisibility = ({ parent, target }) => {
  if (!parent || !target) {
    return
  }
  const { offsetHeight: parentOffsetHeight, scrollTop } = parent
  const { offsetHeight, offsetTop } = target

  if (offsetTop < scrollTop) {
    parent.scrollTo(0, offsetTop)
  } else if (offsetTop + offsetHeight > scrollTop + parentOffsetHeight) {
    parent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight)
  }
}
