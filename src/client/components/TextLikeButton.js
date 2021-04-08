import styled from 'styled-components'

import { focusMixin } from '../styles'

export default styled.button({
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  color: 'inherit',
  '&:hover': {
    fontWeight: 'bold',
  },
  ...focusMixin,
})
