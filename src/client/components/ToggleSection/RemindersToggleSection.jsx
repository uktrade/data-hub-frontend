import styled from 'styled-components'
import { SPACING, FONT_WEIGHTS } from '@govuk-react/constants'

import { GREY_2 } from '../../../client/utils/colours'

import {
  ToggleButton,
  ButtonContent,
  MultiInstanceToggleSection,
} from './BaseToggleSection'

export const RemindersToggleSection = styled(MultiInstanceToggleSection)`
  border-top: 1px solid ${GREY_2};
  ${({ borderBottom }) => borderBottom && `border-bottom: 1px solid ${GREY_2};`}

  ${ToggleButton} {
    text-align: left;
    padding-top: ${SPACING.SCALE_3};
    padding-bottom: ${SPACING.SCALE_3};
  }

  ${ButtonContent} {
    font-weight: ${FONT_WEIGHTS.bold};
  }
`

export default RemindersToggleSection
