import { GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'
import { LIGHT_GREY } from '../../utils/colors'

export default {
  container: {
    backgroundColor: GREY_4,
    largeScreen: {
      padding: '23px 0 0 18px',
    },
  },
  li: {
    before: {
      left: '-8px',
      top: '2px',
      width: SPACING.SCALE_2,
      height: SPACING.SCALE_2,
      border: `2px solid ${LIGHT_GREY}`,
    },
    span: {
      display: 'inline',
    },
    mqLargeScreen: {
      padding: `${SPACING.SCALE_4} 0 ${SPACING.SCALE_4} 0`,
      borderTop: `2px solid ${LIGHT_GREY}`,
      before: {
        top: '-8px',
        left: '-10px',
      },
    },
  },
}
