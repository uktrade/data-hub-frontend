import styled from 'styled-components'
import Button from '@govuk-react/button'
import { SPACING } from '@govuk-react/constants'

import { LINK_COLOUR } from '../../../client/utils/colours'

const ButtonLink = styled(Button).attrs((props) => props)`
  &,
  &:hover,
  &:focus {
    background: transparent;
    box-shadow: none;
    color: ${LINK_COLOUR};
    cursor: pointer;
    text-decoration: underline;
    ${(props) =>
      props.inline &&
      `
      padding: 0;
      margin: 0 0 0 ${SPACING.SCALE_1};
      border: 0;
      width: auto;
      font: inherit;
    `}
  }
`

export default ButtonLink
