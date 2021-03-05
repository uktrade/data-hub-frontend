import styled from 'styled-components'
<<<<<<< HEAD
import { FONT_SIZE } from '@govuk-react/constants'
import { FOCUS_COLOUR, BLACK } from 'govuk-colours'
=======
>>>>>>> Refactor RoutedInputField in terms of the new RoutedInput

import RoutedInput from '../RoutedInput'

export default styled(RoutedInput)({
<<<<<<< HEAD
  fontSize: FONT_SIZE.SIZE_19,
  lineHeight: '25px',
  padding: 6,
  marginTop: 5,
  border: `2px solid ${BLACK}`,
=======
  fontSize: 19,
  lineHeight: '25px',
  padding: 6,
  marginTop: 5,
  border: '2px solid #0b0c0c',
>>>>>>> Refactor RoutedInputField in terms of the new RoutedInput
  appearance: null,
  display: 'block',
  boxSizing: 'border-box',
  width: '100%',
  '&:focus': {
<<<<<<< HEAD
    outline: `3px solid ${FOCUS_COLOUR}`,
=======
    outline: '3px solid #ffdd00',
>>>>>>> Refactor RoutedInputField in terms of the new RoutedInput
    outlineOffset: 0,
  },
})
