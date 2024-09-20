import React from 'react'
import Button from '@govuk-react/button'

import ButtonLink from '..'

export default {
  title: 'ButtonLink',
}

export const Default = () => {
  return (
    <div>
      <Button>Submit</Button>
      <ButtonLink>Cancel</ButtonLink>
    </div>
  )
}

export const Inline = () => {
  return (
    <div>
      Some text <ButtonLink inline={true}>Change</ButtonLink>
    </div>
  )
}
