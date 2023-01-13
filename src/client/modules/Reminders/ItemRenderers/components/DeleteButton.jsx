import { SPACING, FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'

import { DARK_GREY } from '../../../../utils/colors'

const DeleteButton = styled('button')({
  padding: 0,
  border: 'none',
  cursor: 'pointer',
  color: DARK_GREY,
  fontFamily: 'inherit',
  background: 'transparent',
  textDecoration: 'underline',
  fontSize: FONT_SIZE.SIZE_16,
  marginBottom: SPACING.SCALE_4,
  display: ({ isMobile }) => (isMobile ? 'inline' : 'none'),
  [MEDIA_QUERIES.TABLET]: {
    display: ({ isMobile }) => (isMobile ? 'none' : 'inline'),
    margin: `${SPACING.SCALE_3} 0`,
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: ({ isMobile }) => (isMobile ? 'none' : 'inline'),
    margin: `${SPACING.SCALE_3} 0`,
  },
})

export default DeleteButton
