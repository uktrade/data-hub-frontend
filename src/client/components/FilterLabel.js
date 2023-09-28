import styled from 'styled-components'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import { BLACK } from '../../client/utils/colours'

export default styled.label({
  '-webkit-font-smoothing': 'antialiased',
  fontWeight: FONT_WEIGHTS.bold,
  fontSize: FONT_SIZE.SIZE_16,
  display: 'block',
  color: BLACK,
})
