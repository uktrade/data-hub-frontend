import { SPACING } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'
import styled from 'styled-components'

import { ToggleContent } from './BaseToggleSection'
import { ToggleSection } from './ToggleSection'

export const FilterToggleSection = styled(ToggleSection)({
  borderBottom: `solid 1px ${GREY_2}`,
  paddingBottom: SPACING.SCALE_2,

  [ToggleContent]: {
    '> *:last-child': {
      marginBottom: 0,
    },
  },
})

export default FilterToggleSection
