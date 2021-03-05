import styled from 'styled-components'

import RoutedInput from '../RoutedInput'

export default styled(RoutedInput)({
  fontSize: 19,
  lineHeight: '25px',
  padding: 6,
  marginTop: 5,
  border: '2px solid #0b0c0c',
  appearance: null,
  display: 'block',
  boxSizing: 'border-box',
  width: '100%',
  '&:focus': {
    outline: '3px solid #ffdd00',
    outlineOffset: 0,
  },
})
