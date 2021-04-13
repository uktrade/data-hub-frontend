import { FOCUS_COLOUR } from 'govuk-colours'
import { FOCUS_WIDTH } from '@govuk-react/constants'

export const focusMixin = {
  '&:focus': {
    outline: `${FOCUS_WIDTH} solid ${FOCUS_COLOUR}`,
    outlineOffset: '0',
  },
}
