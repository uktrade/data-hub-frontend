import styled from 'styled-components'
import { FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'

import RoutedAdvisersTypeahead from '.'

export default styled(RoutedAdvisersTypeahead)({
  fontSize: FONT_SIZE.SIZE_16,
  [MEDIA_QUERIES.TABLET]: {
    marginBottom: 24,
  },
})
