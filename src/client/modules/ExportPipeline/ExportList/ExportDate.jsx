import { FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'

import RoutedDate from '../../../components/RoutedDateField'

export default styled(RoutedDate)({
  fontFamily: 'Arial, sans-serif',
  fontSize: FONT_SIZE.SIZE_16,
  input: {
    fontSize: FONT_SIZE.SIZE_16,
  },
  [MEDIA_QUERIES.TABLET]: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 2,
    fontSize: FONT_SIZE.SIZE_19,
    input: {
      maxHeight: 36,
      maxWidth: 174,
      fontSize: FONT_SIZE.SIZE_19,
    },
  },
})
