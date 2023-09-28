import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { BLACK, YELLOW } from '../../../client/utils/colours'

import {
  ButtonContent,
  MultiInstanceToggleSection,
  ToggleButton,
  ToggleContent,
} from './BaseToggleSection'

/**
 * This is to be used for toggling groups, this does not replace the "details" component in the [GDS design system](https://design-system.service.gov.uk/components/details/).
 */
export const ToggleSection = styled(MultiInstanceToggleSection)`
  margin-bottom: ${SPACING.SCALE_2};

  ${ToggleButton} {
    padding: ${SPACING.SCALE_2} 0 ${SPACING.SCALE_1};

    &:focus ${ButtonContent} {
      color: ${BLACK};
      background-color: ${YELLOW};
      box-shadow:
        0 -2px ${YELLOW},
        0 4px ${BLACK};
    }
  }

  ${ToggleContent} {
    margin: 0;
    padding: ${SPACING.SCALE_2} 0;
  }
`

export default ToggleSection
