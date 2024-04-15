import { MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'

import { DARK_GREY } from '../../../utils/colours'

export const StyledHintParagraph = styled('p')({
  color: DARK_GREY,
  [MEDIA_QUERIES.DESKTOP]: {
    width: ({ widthPercent }) => `${widthPercent}%` || '100%',
  },
})
