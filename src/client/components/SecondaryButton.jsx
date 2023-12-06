import React from 'react'
import Button from '@govuk-react/button'
import styled from 'styled-components'

import { TEXT_COLOUR, GREY_3 } from '../../client/utils/colours'

const SecondaryButton = React.forwardRef((props, ref) => (
  <Button
    ref={ref}
    buttonColour={GREY_3}
    buttonTextColour={TEXT_COLOUR}
    {...props}
  />
))

SecondaryButton.Inline = styled(SecondaryButton)`
  display: inline-block;
  width: auto;
  font-size: 0.8em;
  vertical-align: baseline;
  padding: 0.2em;
  line-height: 0.5lh;
  margin: 0;
`

export default SecondaryButton
