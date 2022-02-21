import { SPACING } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'
import styled from 'styled-components'

import { ToggleSection } from './ToggleSection'

export default styled(ToggleSection)({
  borderBottom: `solid 1px ${GREY_2}`,
  paddingBottom: SPACING.SCALE_2,
  '&:last-child': {
    borderBottom: 'none',
  },
})
