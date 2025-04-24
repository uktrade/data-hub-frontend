import styled from 'styled-components'
import { GridCol, H3 } from 'govuk-react'
import {
  SPACING,
  FONT_SIZE,
  HEADING_SIZES,
  MEDIA_QUERIES,
  FONT_WEIGHTS,
} from '@govuk-react/constants'

import { DARK_GREY, GREY_2, LINK_COLOUR } from '../../../utils/colours'
import AccessibleLink from '../../../components/Link'

export const DeleteButton = styled('button')({
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

export const RightCol = styled(GridCol)({
  display: 'none',
  textAlign: 'right',
  [MEDIA_QUERIES.TABLET]: {
    display: 'block',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'block',
  },
})

export const ListItem = styled('li')({
  borderBottom: `solid 1px ${GREY_2}`,
})

export const ItemHeader = styled(H3)({
  fontSize: HEADING_SIZES.SMALL,
  marginTop: SPACING.SCALE_3,
  marginBottom: SPACING.SCALE_4,
})

export const ItemHeaderLink = styled(AccessibleLink)({
  fontColor: LINK_COLOUR,
  fontWeight: FONT_WEIGHTS.regular,
})

export const ItemContent = styled('div')({
  color: ({ colour }) => colour,
  marginBottom: SPACING.SCALE_3,
})

export const ItemFooter = styled('div')({
  color: DARK_GREY,
  fontSize: FONT_SIZE.SIZE_16,
  marginBottom: SPACING.SCALE_4,
})
