import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import {
  MultiInstanceToggleSection,
  ToggleButton,
  ToggleContent,
  ButtonContent,
} from './BaseToggleSection'

export const NoHighlightToggleSection = styled(MultiInstanceToggleSection)`
  ${ToggleButton} {
    padding: 0;
  }

  ${ButtonContent} {
    text-decoration: underline;
  }

  ${ToggleContent} {
    padding: ${SPACING.SCALE_2} 0;
  }
`

export default NoHighlightToggleSection
