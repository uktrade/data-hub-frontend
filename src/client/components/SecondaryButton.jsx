import React from 'react'
import Button from '@govuk-react/button'

import { TEXT_COLOUR, GREY_3 } from '../../client/utils/colours'

const SecondaryButton = React.forwardRef((props, ref) => (
  <Button
    ref={ref}
    buttonColour={GREY_3}
    buttonTextColour={TEXT_COLOUR}
    {...props}
  />
))

export default SecondaryButton
