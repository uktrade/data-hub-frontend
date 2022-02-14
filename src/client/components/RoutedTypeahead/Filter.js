import styled from 'styled-components'
import { FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'

import RoutedTypeahead from '../RoutedTypeahead'

export default styled(RoutedTypeahead)({
  fontSize: FONT_SIZE.SIZE_16,
  [MEDIA_QUERIES.TABLET]: {
    marginBottom: 24,
  },
})
