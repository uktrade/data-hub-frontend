import styled from 'styled-components'
import { BLUE, GREY_3, RED } from 'govuk-colours'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import {
  MultiInstanceToggleSection,
  ToggleButton,
  ToggleHeader,
  BadgeContainer,
  ToggleContent,
  ButtonContent,
} from './BaseToggleSection'

export const DashboardToggleSection = styled(MultiInstanceToggleSection)`
  ${({ major }) => `
    border: solid 2px ${GREY_3};
    border-top-color: ${major ? RED : BLUE};
  `}

  ${ToggleHeader} {
    background-color: ${GREY_3};
    padding-top: ${SPACING.SCALE_3};
    padding-bottom: ${SPACING.SCALE_3};
  }

  ${ToggleButton} {
    font-weight: ${FONT_WEIGHTS.regular};
    margin-left: ${SPACING.SCALE_2};
  }

  ${ButtonContent} {
    text-decoration: underline;
  }

  ${BadgeContainer} {
    margin-left: ${SPACING.SCALE_1};
  }

  ${ToggleContent} {
    padding: 0 ${SPACING.SCALE_3};
    margin-top: ${SPACING.SCALE_1};
    margin-bottom: ${SPACING.SCALE_3};
  }
`

export default DashboardToggleSection
