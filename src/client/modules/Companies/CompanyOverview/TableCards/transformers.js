import React from 'react'

import { StyledSpan } from './components'

/**
 * A function that checks if a value exists and returns the styled
 * 'Not set' text if it doesn't.
 * @param {*} conditional The value to be checked
 * @param {*} contents What should display if the conditional is true
 */
export const buildCellContents = (conditional, contents) =>
  conditional ? contents : <StyledSpan>Not set</StyledSpan>
