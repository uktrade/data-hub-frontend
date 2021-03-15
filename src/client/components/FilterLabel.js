import styled from 'styled-components'
import { BLACK } from 'govuk-colours'
import { FONT_WEIGHTS } from '@govuk-react/constants'

export default styled.label({
  '-webkit-font-smoothing': 'antialiased',
  fontWeight: FONT_WEIGHTS.bold,
  display: 'block',
  color: BLACK,
})
