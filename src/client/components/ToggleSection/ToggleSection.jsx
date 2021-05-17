import styled from 'styled-components'
import { BLACK, YELLOW } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

import {
  MultiInstanceToggleSection,
  ToggleButton,
  ButtonContent,
} from './BaseToggleSection'

export const ToggleSection = styled(MultiInstanceToggleSection)`
  margin-bottom: ${SPACING.SCALE_2};

  ${ToggleButton} {
    &:focus ${ButtonContent} {
      color: ${BLACK};
      background-color: ${YELLOW};
      box-shadow: 0 -2px ${YELLOW}, 0 4px ${BLACK};
    }
  }
`

export default ToggleSection
