import styled from 'styled-components'
import { GREY_2 } from 'govuk-colours'
import { H3 } from '@govuk-react/heading'
import { SPACING, FONT_SIZE, HEADING_SIZES } from '@govuk-react/constants'
import { DARK_GREY } from '../../../../utils/colors'

export const ListItem = styled('li')({
  borderBottom: `solid 1px ${GREY_2}`,
})

export const ItemHeader = styled(H3)({
  fontSize: HEADING_SIZES.SMALL,
  marginTop: SPACING.SCALE_3,
  marginBottom: SPACING.SCALE_4,
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
