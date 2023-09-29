import { FOCUS_WIDTH } from '@govuk-react/constants'

import { FOCUS_COLOUR } from '../client/utils/colours'

export const focusMixin = {
  '&:focus': {
    outline: `${FOCUS_WIDTH} solid ${FOCUS_COLOUR}`,
    outlineOffset: '0',
  },
}
