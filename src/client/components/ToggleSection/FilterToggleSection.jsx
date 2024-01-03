import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import { GREY_2 } from '../../../client/utils/colours'

import { ToggleButton, ToggleContent } from './BaseToggleSection'
import { ToggleSection } from './ToggleSection'

export const FilterToggleSection = styled(ToggleSection)({
  borderBottom: `solid 1px ${GREY_2}`,
  paddingBottom: SPACING.SCALE_2,

  [ToggleButton]: {
    textAlign: 'left',
  },

  [ToggleContent]: {
    '> *:last-child': {
      marginBottom: 0,
    },
    '> *:last-child div:last-child': {
      marginBottom: 0,
    },
  },
})

export default FilterToggleSection
