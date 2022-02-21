import styled from 'styled-components'
import { FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'

import RoutedDateField from '.'

export default styled(RoutedDateField)({
  fontSize: FONT_SIZE.SIZE_16,
  input: {
    fontSize: FONT_SIZE.SIZE_16,
  },
  [MEDIA_QUERIES.TABLET]: {
    fontSize: FONT_SIZE.SIZE_16,
    marginBottom: 24,
    input: {
      fontSize: FONT_SIZE.SIZE_16,
    },
  },
})
