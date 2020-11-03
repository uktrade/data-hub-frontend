import styled from 'styled-components'
import { GREY_3 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

const Chip = styled('span')`
  display: inline-block;
  padding: 12px;
  margin: 4px;
  background-color: ${GREY_3};
  border-radius: ${SPACING.SCALE_2};
`

export default Chip
