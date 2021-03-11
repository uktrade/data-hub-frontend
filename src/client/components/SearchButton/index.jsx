import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, WHITE } from 'govuk-colours'
import VisuallyHidden from '@govuk-react/visually-hidden'

const StyledButton = styled('button')`
  position: absolute;
  top: 0;
  right: 0;
  border: 0;
  margin: 0;
  border-radius: 0;
  cursor: pointer;
  padding: 12px;
  overflow: hidden;
  box-sizing: border-box;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  background-color: ${({ backgroundColour }) => backgroundColour};
`

const SearchButton = ({
  size = 40,
  colour = WHITE,
  backgroundColour = BLACK,
}) => (
  <StyledButton type="submit" size={size} backgroundColour={backgroundColour}>
    <>
      <svg viewBox="0 0 18 18" focusable="false" aria-hidden="true">
        <g fill={colour}>
          <path d="M18,16.56l-4.32-4.32a7.65,7.65,0,1,0-1.44,1.44L16.56,18ZM2,7.62a5.6,5.6,0,1,1,5.59,5.59A5.6,5.6,0,0,1,2,7.62Z" />
        </g>
      </svg>
      <VisuallyHidden>Submit Search</VisuallyHidden>
    </>
  </StyledButton>
)

SearchButton.propTypes = {
  size: PropTypes.number,
  colour: PropTypes.string,
  backgroundColour: PropTypes.string,
}

export default SearchButton
