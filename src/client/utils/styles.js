import { FOCUS_COLOUR, BLACK } from './colours'

export const FOCUS_MIXIN = {
  '&:focus': {
    outline: `3px solid transparent`,
    background: FOCUS_COLOUR,
    color: BLACK,
    boxShadow: `0 2px 0 ${BLACK}`,
  },
}
