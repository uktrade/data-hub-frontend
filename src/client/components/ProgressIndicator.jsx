import React from 'react'
import LoadingBox from '@govuk-react/loading-box'
import { SPACING } from '@govuk-react/constants'
import { Spinner } from '@govuk-react/icons'
import styled from 'styled-components'

import InlineIcon from './InlineIcon'

const StyledRoot = styled.div({
  textAlign: 'center',
})

const StyledLoadingBox = styled(LoadingBox)({
  height: SPACING.SCALE_5,
  marginTop: SPACING.SCALE_5,
  marginBottom: SPACING.SCALE_3,
})
/**
 * @function ProgressIndicator
 * @description A progress indicator
 * @param {Object} props
 * @param {string} props.noun - A noun describing the thing in progress
 * @param {string} [props.message = `Loading ${noun}`] - The message
 * rendered underneath the spinner icon.
 * @returns {JSX.Element}
 */
const ProgressIndicator = ({ noun, message = `Loading ${noun}` }) => (
  <StyledRoot>
    <StyledLoadingBox loading={true} />
    {message && <p>{message}</p>}
  </StyledRoot>
)

/**
 * @function ProgressIndicator.Inline
 * @description A progress indicator designed to be rendered nicely in any
 * inline context.
 * @param {Object} props
 * @param {string} props.noun - A noun describing the thing in progress
 * @param {string} [props.message = `Loading ${noun}`] - The message
 * rendered next to the spinner icon.
 * @returns {JSX.Element}
 */
ProgressIndicator.Inline = ({ noun, message = `Loading ${noun}` }) => (
  <>
    <InlineIcon>
      <Spinner />
    </InlineIcon>{' '}
    <span style={{ opacity: 0.3 }}>{message}</span>
  </>
)

export default ProgressIndicator
