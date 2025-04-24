import styled from 'styled-components'
import Button from '@govuk-react/button'
import { SPACING } from '@govuk-react/constants'

import {
  LINK_COLOUR,
  LINK_HOVER_COLOUR,
  BLACK,
  FOCUS_COLOUR,
} from '../../../client/utils/colours'

const ButtonLink = styled(Button).attrs((props) => props)`
  background: transparent;
  color: ${LINK_COLOUR};
  text-decoration: underline;
  box-shadow: none;
  ${(props) =>
    props.inline &&
    `
      padding: 0;
      margin: 0 0 0 ${SPACING.SCALE_1};
      border: 0;
      width: auto;
      font: inherit;
      `}

  &:focus {
    background: ${FOCUS_COLOUR};
    box-shadow: none;
    outline: 3px solid transparent;
    color: ${BLACK};
    box-shadow:
      0 -2px ${FOCUS_COLOUR},
      0 4px ${BLACK};
    text-decoration: none;

    &:hover {
      text-decoration: none;
      background: ${FOCUS_COLOUR};
    }
  }

  &:hover {
    background: transparent;
    color: ${LINK_HOVER_COLOUR};
    cursor: pointer;
    text-decoration: underline;
    text-decoration-thickness: max(3px, 0.1875rem, 0.12em);
    -webkit-text-decoration-skip-ink: none;
    text-decoration-skip-ink: none;
    -webkit-text-decoration-skip: none;
    text-decoration-skip: none;

    &:focus {
      text-decoration: none;
    }
  }
`

export default ButtonLink
