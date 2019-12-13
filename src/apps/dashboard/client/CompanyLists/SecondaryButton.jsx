import React from 'react'
import { TEXT_COLOUR, GREY_3 } from 'govuk-colours'
import Button from '@govuk-react/button'

// TODO: Move to data-hub-components
const SecondaryButton = props =>
  <Button buttonColour={GREY_3} buttonTextColour={TEXT_COLOUR} {...props} />

export default SecondaryButton
