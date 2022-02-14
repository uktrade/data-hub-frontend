import styled from 'styled-components'
import { FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'

import RoutedTeamsTypeahead from '.'

export default styled(RoutedTeamsTypeahead)({
  fontSize: FONT_SIZE.SIZE_16,
  [MEDIA_QUERIES.TABLET]: {
    marginBottom: 24,
  },
})
