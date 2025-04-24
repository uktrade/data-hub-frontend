import React from 'react'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  LINK_COLOUR,
  LINK_HOVER_COLOUR,
  BLACK,
  FOCUS_COLOUR,
  WHITE,
} from '../../utils/colours'

const StyledLink = styled(Link)`
  text-decoration: ${(props) => (props.$showUnderline ? 'underline' : 'none')};
  &:link {
    color: ${(props) => (props.$darkBackground ? WHITE : LINK_COLOUR)};
    &:focus {
      &:hover {
        color: ${BLACK};
      }
    }
  }
  &:hover {
    text-decoration: underline;
    color: ${(props) => (props.$darkBackground ? WHITE : LINK_HOVER_COLOUR)};
    text-decoration-thickness: max(3px, 0.1875rem, 0.12em);
    -webkit-text-decoration-skip-ink: none;
    text-decoration-skip-ink: none;
    -webkit-text-decoration-skip: none;
    text-decoration-skip: none;
  }
  &:visited {
    color: ${(props) => (props.$darkBackground ? WHITE : LINK_COLOUR)};
    &:hover {
      color: ${(props) => (props.$darkBackground ? WHITE : LINK_HOVER_COLOUR)};
    }
    &:focus {
      color: ${BLACK};
    }
  }
  &:focus {
    outline: 3px solid transparent;
    color: ${BLACK};
    box-shadow:
      0 -2px ${FOCUS_COLOUR},
      0 4px ${BLACK};
    text-decoration: none;
    &:hover {
      color: inherit;
    }
  }
`
/*
 *  A styled govuk-react Link to match the design system with an hover accessibily styling to match
 *  the design system. This was flagged in the accessibility report.
 */
const AccessibleLink = ({
  children,
  showUnderline = true,
  darkBackground = false,
  ...rest
}) => (
  <StyledLink
    $showUnderline={showUnderline}
    $darkBackground={darkBackground}
    {...rest}
  >
    {children}
  </StyledLink>
)

export default AccessibleLink

AccessibleLink.propTypes = {
  /**
   * Whether to initial show the link with an underline or not. Will have an underline once
   * hovered. Defaults to true.
   */
  showUnderline: PropTypes.bool,
  /**
   * Whether to the button is on a dark background. If it is, adjust the hover and focus colours.
   */
  darkBackground: PropTypes.bool,
  /**
   * Contains an item that renders below the heading
   */
  children: PropTypes.node,
}
