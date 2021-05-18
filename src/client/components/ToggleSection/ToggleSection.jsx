import styled from 'styled-components'
import { BLACK, YELLOW } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

import {
  ButtonContent,
  MultiInstanceToggleSection,
  ToggleButton,
  ToggleContent,
} from './BaseToggleSection'

export const ToggleSection = styled(MultiInstanceToggleSection)`
  margin-bottom: ${SPACING.SCALE_2};

  ${ToggleButton} {
    padding: ${SPACING.SCALE_2} 0 ${SPACING.SCALE_1};

    &:focus ${ButtonContent} {
      color: ${BLACK};
      background-color: ${YELLOW};
      box-shadow: 0 -2px ${YELLOW}, 0 4px ${BLACK};
    }
  }

  ${ToggleContent} {
    margin: 0;
    padding: ${SPACING.SCALE_2} 0;
  }
`

export default ToggleSection
