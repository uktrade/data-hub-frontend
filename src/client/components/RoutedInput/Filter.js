import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'
import { FOCUS_COLOUR, BLACK } from 'govuk-colours'

import RoutedInput from '../RoutedInput'

export default styled(RoutedInput)({
  fontSize: FONT_SIZE.SIZE_19,
  lineHeight: '25px',
  padding: 6,
  marginTop: 5,
  border: `2px solid ${BLACK}`,
  appearance: null,
  display: 'block',
  boxSizing: 'border-box',
  width: '100%',
  '&:focus': {
    outline: `3px solid ${FOCUS_COLOUR}`,
    outlineOffset: 0,
  },
})
