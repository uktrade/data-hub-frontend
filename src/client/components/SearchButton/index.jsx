import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, WHITE } from 'govuk-colours'
import VisuallyHidden from '@govuk-react/visually-hidden'

const StyledButton = styled('button')`
  position: absolute;
  top: 1px;
  right: 1px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  padding: 10px;
  overflow: hidden;
  border-radius: 0;
  box-sizing: border-box;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  background-color: ${({ backgroundColour }) => backgroundColour};
`

const SearchButton = ({
  size = 38,
  colour = WHITE,
  backgroundColour = BLACK,
}) => (
  <StyledButton type="submit" size={size} backgroundColour={backgroundColour}>
    <>
      <svg viewBox="0 0 512 512" focusable="false" aria-hidden="true">
        <g fill={colour}>
          <path d="M364,322.6h-23.3l-8.4-7.4c27.9-33.5,45.6-76.3,45.6-124.7C377.9,85.2,293.2,0.5,188,0.5   C84.7,0.5,0,85.2,0,190.4s84.7,189.9,189.9,189.9c46.5,0,90.3-17.7,123.8-45.6l8.4,7.4v23.3l146.2,146.2l43.8-43.8L364,322.6z    M189,322.6c-72.6,0-131.3-58.6-131.3-131.3C57.7,117.8,116.4,60,189,60s131.3,58.6,131.3,131.3S261.6,322.6,189,322.6z" />
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
